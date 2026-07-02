from __future__ import annotations

import requests
from playwright.sync_api import sync_playwright

from job_auto_apply.config import resolve_resume_path
from job_auto_apply.models import ApplicationStatus, JobApplication, JobListing
from job_auto_apply.platforms.base import PlatformAdapter


class GreenhouseAdapter(PlatformAdapter):
    name = "greenhouse"

    def search(self) -> list[JobListing]:
        listings: list[JobListing] = []
        for company in self.profile.greenhouse.companies:
            api_url = f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs"
            try:
                response = requests.get(api_url, timeout=30)
                response.raise_for_status()
                payload = response.json()
            except requests.RequestException:
                continue

            for item in payload.get("jobs", []):
                if len(listings) >= self.profile.search.max_jobs_per_run:
                    return listings

                title = item.get("title", "")
                if not title or self.should_skip_title(title):
                    continue

                keywords = self.profile.search.keywords.lower().split()
                haystack = f"{title} {item.get('content', '')}".lower()
                if keywords and not any(keyword in haystack for keyword in keywords):
                    continue

                location = ""
                if item.get("location"):
                    location = item["location"].get("name", "")

                listings.append(
                    JobListing(
                        platform=self.name,
                        external_id=str(item.get("id", item.get("absolute_url", ""))),
                        title=title,
                        company=company.title(),
                        location=location,
                        url=item.get("absolute_url", ""),
                        easy_apply=True,
                    )
                )
        return listings

    def apply(self, job: JobListing, dry_run: bool) -> JobApplication:
        application = JobApplication(job=job, status=ApplicationStatus.QUEUED)
        resume_path = resolve_resume_path(self.profile)
        if not resume_path.exists():
            application.status = ApplicationStatus.FAILED
            application.notes = f"Resume not found at {resume_path}"
            return application

        cover_letter = self.profile.render_cover_letter(job.company, job.title)
        personal = self.profile.personal

        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=self.headless)
            page = browser.new_page()
            try:
                page.goto(job.url, wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(1500)

                apply_link = page.locator("a:has-text('Apply for this job'), #apply_button").first
                if apply_link.count():
                    apply_link.click()
                    page.wait_for_timeout(1500)

                if dry_run:
                    application.status = ApplicationStatus.QUEUED
                    application.notes = "Dry run: would fill Greenhouse application"
                    return application

                self._fill_if_present(page, "#first_name", personal.first_name)
                self._fill_if_present(page, "#last_name", personal.last_name)
                self._fill_if_present(page, "#email", personal.email)
                self._fill_if_present(page, "#phone", personal.phone)

                file_input = page.locator("input[type='file']").first
                if file_input.count():
                    file_input.set_input_files(str(resume_path))

                cover_field = page.locator("#cover_letter, textarea[name='job_application[cover_letter]']").first
                if cover_field.count() and cover_letter:
                    cover_field.fill(cover_letter)

                submit = page.locator("#submit_app, button:has-text('Submit application')").first
                if submit.count():
                    submit.click()
                    page.wait_for_timeout(3000)
                    application.status = ApplicationStatus.APPLIED
                    application.notes = "Submitted via Greenhouse"
                else:
                    application.status = ApplicationStatus.FAILED
                    application.notes = "Greenhouse submit button not found"
            except Exception as exc:  # noqa: BLE001
                application.status = ApplicationStatus.FAILED
                application.notes = str(exc)
            finally:
                browser.close()
        return application

    @staticmethod
    def _fill_if_present(page, selector: str, value: str) -> None:
        field = page.locator(selector).first
        if field.count() and value:
            field.fill(value)

from __future__ import annotations

import re
from urllib.parse import quote_plus, urljoin

from playwright.sync_api import TimeoutError as PlaywrightTimeout
from playwright.sync_api import sync_playwright

from job_auto_apply.config import resolve_resume_path
from job_auto_apply.models import ApplicationStatus, JobApplication, JobListing
from job_auto_apply.platforms.base import PlatformAdapter


class IndeedAdapter(PlatformAdapter):
    name = "indeed"

    def search(self) -> list[JobListing]:
        keywords = quote_plus(self.profile.search.keywords)
        location = quote_plus(self.profile.search.location)
        url = f"https://www.indeed.com/jobs?q={keywords}&l={location}"

        listings: list[JobListing] = []
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=self.headless)
            page = browser.new_page()
            page.goto(url, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(2000)

            cards = page.locator(".job_seen_beacon, .cardOutline, .resultContent").all()
            for card in cards:
                if len(listings) >= self.profile.search.max_jobs_per_run:
                    break
                try:
                    title_el = card.locator("h2.jobTitle span, a[data-jk] span").first
                    title = title_el.inner_text(timeout=2000).strip()
                    if not title or self.should_skip_title(title):
                        continue

                    company = ""
                    company_el = card.locator("[data-testid='company-name'], .companyName").first
                    if company_el.count():
                        company = company_el.inner_text(timeout=1000).strip()

                    location_text = ""
                    location_el = card.locator("[data-testid='text-location'], .companyLocation").first
                    if location_el.count():
                        location_text = location_el.inner_text(timeout=1000).strip()

                    link = card.locator("h2.jobTitle a, a[data-jk]").first
                    href = link.get_attribute("href") or ""
                    job_url = urljoin("https://www.indeed.com", href)
                    job_id_match = re.search(r"jk=([a-f0-9]+)", job_url)
                    external_id = job_id_match.group(1) if job_id_match else job_url

                    easy_apply = card.locator("span:has-text('Easily apply')").count() > 0

                    listings.append(
                        JobListing(
                            platform=self.name,
                            external_id=external_id,
                            title=title,
                            company=company or "Unknown",
                            location=location_text,
                            url=job_url,
                            easy_apply=easy_apply,
                        )
                    )
                except PlaywrightTimeout:
                    continue
            browser.close()
        return listings

    def apply(self, job: JobListing, dry_run: bool) -> JobApplication:
        application = JobApplication(job=job, status=ApplicationStatus.QUEUED)
        if not job.easy_apply:
            application.status = ApplicationStatus.SKIPPED
            application.notes = "Not an Indeed Easy Apply job"
            return application

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

                apply_button = page.locator(
                    "button:has-text('Apply now'), button:has-text('Easily apply'), "
                    "button:has-text('Apply on company site')"
                ).first
                if not apply_button.count():
                    application.status = ApplicationStatus.FAILED
                    application.notes = "Apply button not found"
                    return application

                if dry_run:
                    application.status = ApplicationStatus.QUEUED
                    application.notes = "Dry run: would click Apply and fill form"
                    return application

                apply_button.click()
                page.wait_for_timeout(2000)

                self._fill_if_present(page, "input[name='firstName'], input#input-firstName]", personal.first_name)
                self._fill_if_present(page, "input[name='lastName'], input#input-lastName]", personal.last_name)
                self._fill_if_present(page, "input[type='email'], input[name='email']", personal.email)
                self._fill_if_present(page, "input[type='tel'], input[name='phone']", personal.phone)

                file_input = page.locator("input[type='file']").first
                if file_input.count():
                    file_input.set_input_files(str(resume_path))

                textarea = page.locator("textarea").first
                if textarea.count() and cover_letter:
                    textarea.fill(cover_letter)

                submit = page.locator(
                    "button:has-text('Submit'), button:has-text('Apply'), button[type='submit']"
                ).first
                if submit.count():
                    submit.click()
                    page.wait_for_timeout(3000)
                    application.status = ApplicationStatus.APPLIED
                    application.notes = "Submitted via Indeed Easy Apply"
                else:
                    application.status = ApplicationStatus.FAILED
                    application.notes = "Submit button not found after filling form"
            except Exception as exc:  # noqa: BLE001 - surface automation errors to tracker
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

from __future__ import annotations

import time
from datetime import datetime
from pathlib import Path

from rich.console import Console
from rich.table import Table

from job_auto_apply.config import AppSettings, Profile, load_profile
from job_auto_apply.database import ApplicationStore
from job_auto_apply.models import ApplicationStatus, JobApplication, JobListing
from job_auto_apply.platforms import ADAPTERS

console = Console()


class JobApplier:
    def __init__(self, profile: Profile, store: ApplicationStore, headless: bool = True) -> None:
        self.profile = profile
        self.store = store
        self.headless = headless

    def search_jobs(self, platforms: list[str] | None = None) -> list[JobApplication]:
        selected = platforms or self.profile.search.platforms
        discovered: list[JobApplication] = []

        for platform_name in selected:
            adapter_cls = ADAPTERS.get(platform_name)
            if not adapter_cls:
                console.print(f"[yellow]Unknown platform: {platform_name}[/yellow]")
                continue

            adapter = adapter_cls(self.profile, headless=self.headless)
            console.print(f"[cyan]Searching {platform_name}...[/cyan]")
            listings = adapter.search()
            console.print(f"  Found {len(listings)} jobs on {platform_name}")

            for listing in listings:
                if self.store.has_seen(listing.platform, listing.external_id):
                    continue
                application = JobApplication(
                    job=listing,
                    status=ApplicationStatus.DISCOVERED,
                )
                saved = self.store.save(application)
                discovered.append(saved)

        return discovered

    def queue_job(self, application_id: int) -> JobApplication | None:
        applications = self.store.list_all()
        for application in applications:
            if application.id == application_id:
                application.status = ApplicationStatus.QUEUED
                return self.store.save(application)
        return None

    def queue_all_discovered(self) -> int:
        count = 0
        for application in self.store.get_discovered():
            application.status = ApplicationStatus.QUEUED
            self.store.save(application)
            count += 1
        return count

    def apply_queued(self, dry_run: bool | None = None) -> list[JobApplication]:
        use_dry_run = self.profile.application.dry_run if dry_run is None else dry_run
        delay = self.profile.application.delay_seconds
        results: list[JobApplication] = []

        queued = self.store.get_queued()
        if not queued:
            console.print("[yellow]No queued applications. Run search first or queue jobs.[/yellow]")
            return results

        mode = "DRY RUN" if use_dry_run else "LIVE"
        console.print(f"[bold]Applying to {len(queued)} jobs ({mode})[/bold]")

        for index, application in enumerate(queued):
            adapter_cls = ADAPTERS.get(application.job.platform)
            if not adapter_cls:
                application.status = ApplicationStatus.FAILED
                application.notes = f"No adapter for {application.job.platform}"
                results.append(self.store.save(application))
                continue

            adapter = adapter_cls(self.profile, headless=self.headless)
            console.print(
                f"[{index + 1}/{len(queued)}] {application.job.title} @ {application.job.company}"
            )

            result = adapter.apply(application.job, dry_run=use_dry_run)
            result.id = application.id
            result.created_at = application.created_at
            if result.status == ApplicationStatus.APPLIED:
                result.applied_at = datetime.utcnow()

            saved = self.store.save(result)
            results.append(saved)
            console.print(f"  -> {saved.status.value}: {saved.notes}")

            if index < len(queued) - 1 and delay > 0:
                time.sleep(delay)

        return results

    def run_auto(self, dry_run: bool | None = None) -> dict[str, int]:
        """Search, queue new jobs, and apply in one pass."""
        discovered = self.search_jobs()
        queued = 0
        for application in discovered:
            application.status = ApplicationStatus.QUEUED
            self.store.save(application)
            queued += 1

        results = self.apply_queued(dry_run=dry_run)
        summary = {
            "discovered": len(discovered),
            "queued": queued,
            "applied": sum(1 for r in results if r.status == ApplicationStatus.APPLIED),
            "skipped": sum(1 for r in results if r.status == ApplicationStatus.SKIPPED),
            "failed": sum(1 for r in results if r.status == ApplicationStatus.FAILED),
        }
        return summary


def build_applier(config_path: Path | None = None) -> JobApplier:
    settings = AppSettings()
    profile = load_profile(config_path or settings.config_path)
    db_path = settings.data_dir / "applications.db"
    store = ApplicationStore(db_path)
    return JobApplier(profile, store, headless=settings.headless)


def print_applications(applications: list[JobApplication]) -> None:
    table = Table(title="Job Applications")
    table.add_column("ID", style="dim")
    table.add_column("Status")
    table.add_column("Platform")
    table.add_column("Title")
    table.add_column("Company")
    table.add_column("Notes")

    for app in applications:
        table.add_row(
            str(app.id or "-"),
            app.status.value,
            app.job.platform,
            app.job.title[:40],
            app.job.company[:20],
            (app.notes or "")[:50],
        )
    console.print(table)

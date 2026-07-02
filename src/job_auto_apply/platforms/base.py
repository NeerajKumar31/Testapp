from __future__ import annotations

from abc import ABC, abstractmethod

from job_auto_apply.config import Profile
from job_auto_apply.models import JobApplication, JobListing


class PlatformAdapter(ABC):
    name: str

    def __init__(self, profile: Profile, headless: bool = True) -> None:
        self.profile = profile
        self.headless = headless

    @abstractmethod
    def search(self) -> list[JobListing]:
        """Return job listings matching the profile search config."""

    @abstractmethod
    def apply(self, job: JobListing, dry_run: bool) -> JobApplication:
        """Submit or simulate an application for a single job."""

    def should_skip_title(self, title: str) -> bool:
        lowered = title.lower()
        return any(keyword.lower() in lowered for keyword in self.profile.search.exclude_title_keywords)

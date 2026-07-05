from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class ApplicationStatus(str, Enum):
    DISCOVERED = "discovered"
    QUEUED = "queued"
    APPLIED = "applied"
    SKIPPED = "skipped"
    FAILED = "failed"


class JobListing(BaseModel):
    platform: str
    external_id: str
    title: str
    company: str
    location: str = ""
    url: str
    easy_apply: bool = False


class JobApplication(BaseModel):
    id: int | None = None
    job: JobListing
    status: ApplicationStatus = ApplicationStatus.DISCOVERED
    notes: str = ""
    applied_at: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

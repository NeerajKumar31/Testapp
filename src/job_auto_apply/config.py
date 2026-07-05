from __future__ import annotations

from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class PersonalInfo(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    location: str
    linkedin_url: str = ""
    portfolio_url: str = ""
    github_url: str = ""


class ResumeConfig(BaseModel):
    path: str
    summary: str = ""


class SearchConfig(BaseModel):
    keywords: str
    location: str = "Remote"
    platforms: list[Literal["indeed", "greenhouse"]] = Field(default_factory=lambda: ["indeed"])
    exclude_title_keywords: list[str] = Field(default_factory=list)
    max_jobs_per_run: int = 10


class ApplicationConfig(BaseModel):
    dry_run: bool = True
    delay_seconds: int = 30
    cover_letter: str = ""


class GreenhouseConfig(BaseModel):
    companies: list[str] = Field(default_factory=list)


class Profile(BaseModel):
    personal: PersonalInfo
    resume: ResumeConfig
    search: SearchConfig
    application: ApplicationConfig = Field(default_factory=ApplicationConfig)
    greenhouse: GreenhouseConfig = Field(default_factory=GreenhouseConfig)

    @property
    def full_name(self) -> str:
        return f"{self.personal.first_name} {self.personal.last_name}"

    def render_cover_letter(self, company: str, title: str) -> str:
        template = self.application.cover_letter or self.resume.summary
        return template.format(
            company=company,
            title=title,
            first_name=self.personal.first_name,
            last_name=self.personal.last_name,
            email=self.personal.email,
        )


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="JOB_APPLY_", extra="ignore")

    config_path: Path = Path("config/profile.yaml")
    headless: bool = True
    data_dir: Path = Path("data")


def load_profile(path: Path | None = None) -> Profile:
    settings = AppSettings()
    config_path = path or settings.config_path
    if not config_path.exists():
        raise FileNotFoundError(
            f"Profile not found at {config_path}. "
            f"Copy config/profile.example.yaml to {config_path} and edit it."
        )
    with config_path.open(encoding="utf-8") as handle:
        raw = yaml.safe_load(handle)
    return Profile.model_validate(raw)


def resolve_resume_path(profile: Profile, base_dir: Path | None = None) -> Path:
    resume = Path(profile.resume.path)
    if resume.is_absolute():
        return resume
    root = base_dir or Path.cwd()
    return (root / resume).resolve()

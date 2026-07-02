from __future__ import annotations

from datetime import datetime
from pathlib import Path

from sqlalchemy import DateTime, Integer, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

from job_auto_apply.models import ApplicationStatus, JobApplication, JobListing


class Base(DeclarativeBase):
    pass


class ApplicationRecord(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    platform: Mapped[str] = mapped_column(String(50), index=True)
    external_id: Mapped[str] = mapped_column(String(255), index=True)
    title: Mapped[str] = mapped_column(String(500))
    company: Mapped[str] = mapped_column(String(255))
    location: Mapped[str] = mapped_column(String(255), default="")
    url: Mapped[str] = mapped_column(Text)
    easy_apply: Mapped[str] = mapped_column(String(10), default="false")
    status: Mapped[str] = mapped_column(String(20), index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    applied_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ApplicationStore:
    def __init__(self, db_path: Path) -> None:
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self.engine = create_engine(f"sqlite:///{db_path}")
        Base.metadata.create_all(self.engine)

    def _to_record(self, application: JobApplication) -> ApplicationRecord:
        job = application.job
        return ApplicationRecord(
            id=application.id,
            platform=job.platform,
            external_id=job.external_id,
            title=job.title,
            company=job.company,
            location=job.location,
            url=job.url,
            easy_apply="true" if job.easy_apply else "false",
            status=application.status.value,
            notes=application.notes,
            applied_at=application.applied_at,
            created_at=application.created_at,
        )

    def _from_record(self, record: ApplicationRecord) -> JobApplication:
        return JobApplication(
            id=record.id,
            job=JobListing(
                platform=record.platform,
                external_id=record.external_id,
                title=record.title,
                company=record.company,
                location=record.location,
                url=record.url,
                easy_apply=record.easy_apply == "true",
            ),
            status=ApplicationStatus(record.status),
            notes=record.notes,
            applied_at=record.applied_at,
            created_at=record.created_at,
        )

    def has_seen(self, platform: str, external_id: str) -> bool:
        with Session(self.engine) as session:
            stmt = select(ApplicationRecord).where(
                ApplicationRecord.platform == platform,
                ApplicationRecord.external_id == external_id,
            )
            return session.scalar(stmt) is not None

    def save(self, application: JobApplication) -> JobApplication:
        record = self._to_record(application)
        with Session(self.engine) as session:
            if record.id:
                merged = session.merge(record)
            else:
                session.add(record)
                merged = record
            session.commit()
            session.refresh(merged)
            return self._from_record(merged)

    def list_all(self, status: ApplicationStatus | None = None) -> list[JobApplication]:
        with Session(self.engine) as session:
            stmt = select(ApplicationRecord).order_by(ApplicationRecord.created_at.desc())
            if status:
                stmt = stmt.where(ApplicationRecord.status == status.value)
            records = session.scalars(stmt).all()
            return [self._from_record(record) for record in records]

    def get_queued(self) -> list[JobApplication]:
        return self.list_all(ApplicationStatus.QUEUED)

    def get_discovered(self) -> list[JobApplication]:
        return self.list_all(ApplicationStatus.DISCOVERED)

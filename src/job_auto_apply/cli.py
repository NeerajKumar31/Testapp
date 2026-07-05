from __future__ import annotations

from pathlib import Path

import click
from rich.console import Console

from job_auto_apply.applier import build_applier, print_applications
from job_auto_apply.config import load_profile
from job_auto_apply.models import ApplicationStatus

console = Console()


@click.group()
@click.option("--config", "config_path", type=click.Path(path_type=Path), default=None, help="Path to profile YAML")
@click.pass_context
def main(ctx: click.Context, config_path: Path | None) -> None:
    """Automatically search and apply to jobs."""
    ctx.ensure_object(dict)
    ctx.obj["config_path"] = config_path


@main.command("init")
def init_profile() -> None:
    """Create config/profile.yaml from the example template."""
    example = Path("config/profile.example.yaml")
    target = Path("config/profile.yaml")
    if target.exists():
        console.print("[yellow]config/profile.yaml already exists[/yellow]")
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(example.read_text(encoding="utf-8"), encoding="utf-8")
    console.print("[green]Created config/profile.yaml — edit it with your details[/green]")
    console.print("Place your resume at resumes/resume.pdf (or update the path in the config).")


@main.command("search")
@click.option("--platform", multiple=True, help="Limit search to platform(s): indeed, greenhouse")
@click.pass_context
def search(ctx: click.Context, platform: tuple[str, ...]) -> None:
    """Search for jobs and save new listings."""
    applier = build_applier(ctx.obj["config_path"])
    platforms = list(platform) if platform else None
    discovered = applier.search_jobs(platforms=platforms)
    console.print(f"\n[bold green]{len(discovered)} new jobs saved[/bold green]")
    print_applications(discovered)


@main.command("list")
@click.option("--status", type=click.Choice([s.value for s in ApplicationStatus]), default=None)
@click.pass_context
def list_apps(ctx: click.Context, status: str | None) -> None:
    """List tracked applications."""
    applier = build_applier(ctx.obj["config_path"])
    status_enum = ApplicationStatus(status) if status else None
    applications = applier.store.list_all(status_enum)
    print_applications(applications)


@main.command("queue")
@click.option("--all", "queue_all", is_flag=True, help="Queue all discovered jobs")
@click.argument("application_id", required=False, type=int)
@click.pass_context
def queue(ctx: click.Context, queue_all: bool, application_id: int | None) -> None:
    """Queue job(s) for application."""
    applier = build_applier(ctx.obj["config_path"])
    if queue_all:
        count = applier.queue_all_discovered()
        console.print(f"[green]Queued {count} jobs[/green]")
        return
    if application_id is None:
        raise click.UsageError("Provide an application ID or use --all")
    result = applier.queue_job(application_id)
    if result:
        console.print(f"[green]Queued #{application_id}: {result.job.title}[/green]")
    else:
        console.print(f"[red]Application #{application_id} not found[/red]")


@main.command("apply")
@click.option("--live", is_flag=True, help="Submit real applications (overrides dry_run in config)")
@click.pass_context
def apply(ctx: click.Context, live: bool) -> None:
    """Apply to all queued jobs."""
    applier = build_applier(ctx.obj["config_path"])
    dry_run = not live
    if live:
        profile = load_profile(ctx.obj["config_path"])
        if profile.application.dry_run:
            console.print("[yellow]Running in LIVE mode (--live flag)[/yellow]")
    results = applier.apply_queued(dry_run=dry_run)
    applied = sum(1 for r in results if r.status == ApplicationStatus.APPLIED)
    failed = sum(1 for r in results if r.status == ApplicationStatus.FAILED)
    console.print(f"\n[bold]Done: {applied} applied, {failed} failed[/bold]")


@main.command("auto")
@click.option("--live", is_flag=True, help="Submit real applications (overrides dry_run in config)")
@click.pass_context
def auto(ctx: click.Context, live: bool) -> None:
    """Search, queue, and apply in one command."""
    applier = build_applier(ctx.obj["config_path"])
    summary = applier.run_auto(dry_run=not live)
    console.print(
        f"\n[bold]Auto run complete[/bold]\n"
        f"  Discovered: {summary['discovered']}\n"
        f"  Queued:     {summary['queued']}\n"
        f"  Applied:    {summary['applied']}\n"
        f"  Skipped:    {summary['skipped']}\n"
        f"  Failed:     {summary['failed']}"
    )


if __name__ == "__main__":
    main()

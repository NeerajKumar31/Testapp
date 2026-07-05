# Job Auto Apply

Automatically search for jobs and submit applications using your profile, resume, and cover letter.

## Features

- **Multi-platform search** — Indeed (Easy Apply) and Greenhouse company boards
- **Profile-driven forms** — Fills name, email, phone, resume, and cover letter from config
- **Application tracking** — SQLite database records every job and status
- **Safe by default** — `dry_run: true` simulates applications until you opt in
- **One-command workflow** — `job-apply auto` searches, queues, and applies

## Quick start

```bash
# Install dependencies
pip install -e .
playwright install chromium

# Create your profile
job-apply init
# Edit config/profile.yaml with your details
# Add your resume to resumes/resume.pdf

# Dry-run: search + simulate applications
job-apply auto

# Live applications (after reviewing config)
job-apply auto --live
```

## Commands

| Command | Description |
|---------|-------------|
| `job-apply init` | Copy example config to `config/profile.yaml` |
| `job-apply search` | Find new jobs and save to tracker |
| `job-apply list` | Show all tracked applications |
| `job-apply queue --all` | Queue discovered jobs for applying |
| `job-apply apply` | Apply to queued jobs (respects `dry_run`) |
| `job-apply apply --live` | Submit real applications |
| `job-apply auto` | Search → queue → apply in one step |

## Configuration

Copy `config/profile.example.yaml` to `config/profile.yaml` and set:

- **personal** — Contact info used on application forms
- **resume.path** — Path to your PDF resume
- **search** — Keywords, location, platforms, filters
- **application.dry_run** — Set to `false` for live mode (or use `--live`)
- **greenhouse.companies** — Board slugs (e.g. `stripe` from `boards.greenhouse.io/stripe`)

Cover letters support placeholders: `{company}`, `{title}`, `{first_name}`, `{last_name}`, `{email}`.

## Workflow

```
search → discovered → queue → apply → applied / skipped / failed
```

Jobs already in the database are skipped on subsequent searches to avoid duplicate applications.

## Important notes

- **Terms of service** — Automated applying may violate some job sites' policies. Use responsibly and at your own risk.
- **Site changes** — Selectors may break when sites update their UI; adapters can be extended in `src/job_auto_apply/platforms/`.
- **Rate limiting** — `application.delay_seconds` adds a pause between applications (default 30s).
- **Indeed** — Only "Easily apply" listings are auto-submitted; others are marked skipped.
- **Greenhouse** — Uses the public jobs API for search and Playwright for form submission.

## Project structure

```
config/profile.example.yaml   # Example profile
src/job_auto_apply/
  cli.py                      # CLI entry point
  applier.py                  # Search/queue/apply orchestration
  config.py                   # Profile loading
  database.py                 # SQLite tracker
  platforms/
    indeed.py                 # Indeed adapter
    greenhouse.py             # Greenhouse adapter
data/applications.db        # Created at runtime
```

## Extending

Add a new platform by subclassing `PlatformAdapter` in `platforms/base.py`, implementing `search()` and `apply()`, and registering it in `platforms/__init__.py`.

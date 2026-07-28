# Transfer Hearth to its own GitHub repository

This branch contains **only** the Hearth Dream Home AI app at the repository root (not nested under Testapp).

The Cursor agent token can push to `NeerajKumar31/Testapp` but **cannot create** a new GitHub repository. Create an empty repo, then push this branch into it.

## Option A — from this branch

1. On GitHub, create a new **empty** repository (no README), e.g. `NeerajKumar31/hearth-dream-home`.
2. Run:

```bash
git clone https://github.com/NeerajKumar31/Testapp.git
cd Testapp
git checkout cursor/hearth-standalone-1edf
git remote remove origin
git remote add origin https://github.com/NeerajKumar31/hearth-dream-home.git
git push -u origin HEAD:main
```

## Option B — from the git bundle

```bash
git clone hearth-dream-home.bundle hearth-dream-home
cd hearth-dream-home
git remote add origin https://github.com/NeerajKumar31/hearth-dream-home.git
git push -u origin main
```

After the new repo exists and this GitHub App / Cursor environment is granted access, the agent can push updates there directly.

# Transfer Hearth into `hearth-dream-home`

Standalone Hearth source lives on this branch (app at repository root).

## Blocker for Cursor agents

The Cursor GitHub App is currently installed only on `NeerajKumar31/Testapp`, so agents get **403** when pushing to `NeerajKumar31/hearth-dream-home`.

### Grant access (then re-ask the agent to push)

1. Open https://github.com/settings/installations
2. Select **Cursor**
3. Under repository access, include **`hearth-dream-home`** (or choose “All repositories”)
4. Save, then tell the agent to push again

Or install/configure here: https://github.com/apps/cursor

## Push yourself (fastest)

```bash
git clone --branch cursor/hearth-standalone-1edf --single-branch \
  https://github.com/NeerajKumar31/Testapp.git hearth-temp
cd hearth-temp
git remote set-url origin https://github.com/NeerajKumar31/hearth-dream-home.git
git push -u origin HEAD:main
```

## From git bundle

```bash
git clone hearth-dream-home.bundle hearth-dream-home
cd hearth-dream-home
git remote add origin https://github.com/NeerajKumar31/hearth-dream-home.git
git push -u origin HEAD:main
```

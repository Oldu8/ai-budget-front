# /git-save

Inspect the current git working tree and do the following:

1. Review changed files and `git diff`. If there is nothing to commit, report that and stop.
2. Propose a short **semantic slug** in kebab-case (e.g. `recurring-expenses`, `fix-login-redirect`). It describes the change, not the version.
3. **Bump the patch version** in `package.json` (`version` field), semver-style: `0.8.1` → `0.8.2` → `0.8.3`. We are pre-MVP, so the major/minor stays put and every save increments only the patch number. If the project also pins the same version elsewhere (e.g. `app.json`, `app.config.*`), update it in the same commit.
4. Create and switch to a new branch whose name **starts with the new version**, then the slug, e.g. `0.8.2-feat-recurring-expenses` or `0.8.2-fix-login-redirect`. Use the conventional commit **type** as a short infix if helpful (`feat`, `fix`, …). If that branch already exists, append a short suffix (`-2`, `-retry`, timestamp fragment).
5. Stage all **relevant** changes (app code, shared, features, locales, etc.). Skip or ask before staging purely local/editor noise (e.g. unrelated `.cursor/` drafts) unless the user clearly wants everything.
6. Write one **conventional** commit title (under 72 chars) and optional body, grounded in the actual diff. The commit should include both the version bump and the feature/fix unless the user asked otherwise.
7. Commit.
8. Print: **branch name**, **commit title** (and body if used), **`git status`**.

Rules:

- Conventional commits: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`.
- Title: max 72 characters; body optional for bullet summary.
- Be specific; match the real diff.
- If `package.json` has no `version`, say so and either skip the version-in-branch rule or use another agreed source.

Notes:

- **Order matters:** version bump and branch name must happen **before** `git commit`, and the branch name must use the **new** version from step 3.
- **Patch-only while pre-MVP.** Keep bumping the patch (`0.8.x`) on every save. Do not bump minor or major unless the user explicitly asks for it (e.g. at MVP release we move to `1.0.0`).

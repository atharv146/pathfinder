#!/usr/bin/env bash
#
# ship — verify, commit, push. One command, from the repo root:
#
#   ./scripts/ship.sh "commit message"
#   ./scripts/ship.sh            # verify + push already-made commits
#
# WHY THIS EXISTS (Aug 17, 2026): every push to master auto-deploys to
# production on Vercel. There is no staging environment and no review step, so
# "the build was broken on master for twenty minutes" is a user-facing outage
# on a site aimed at students who may be on one shot at a deadline. This makes
# the full check the *default path* rather than something to remember.
#
# It refuses to push if anything fails. That refusal is the entire point — if
# you want to skip it you can still run git push yourself, deliberately.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
MESSAGE="${1:-}"

echo "▸ Branch: $BRANCH"

# ---------------------------------------------------------------------------
# 1. Verify. Cheapest checks first so a failure surfaces in seconds.
# ---------------------------------------------------------------------------
echo "▸ Verifying (typecheck → lint → tests → build)…"
( cd app && npm run verify )

# ---------------------------------------------------------------------------
# 2. Commit, if there's anything to commit and a message was given.
# ---------------------------------------------------------------------------
if [[ -n "$(git status --porcelain)" ]]; then
  if [[ -z "$MESSAGE" ]]; then
    echo "✗ Uncommitted changes, but no commit message given."
    echo "  Run: ./scripts/ship.sh \"what you changed\""
    exit 1
  fi
  echo "▸ Committing…"
  git add -A
  git commit -q -m "$MESSAGE"
else
  echo "▸ Nothing to commit."
fi

# ---------------------------------------------------------------------------
# 3. Push. Nothing to do if we're already in sync.
# ---------------------------------------------------------------------------
if [[ -z "$(git log "origin/$BRANCH..$BRANCH" --oneline 2>/dev/null)" ]]; then
  echo "✓ Already up to date with origin/$BRANCH. Nothing to push."
  exit 0
fi

echo "▸ Pushing to origin/$BRANCH…"
git push origin "$BRANCH"

echo "✓ Pushed. Vercel is building: https://pathfinder-atharv.vercel.app"

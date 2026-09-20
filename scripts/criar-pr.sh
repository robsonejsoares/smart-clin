#!/usr/bin/env bash

set -e

BRANCH_ATUAL="$(git branch --show-current)"

if [[ -z "$BRANCH_ATUAL" ]]; then
  echo "Não foi possível identificar a branch atual."
  exit 1
fi

case "$BRANCH_ATUAL" in
  feature/*|feat/*|fix/*|hotfix/*|docs/*|style/*|refactor/*|perf/*|test/*|build/*|ci/*|chore/*|revert/*)
    BASE_BRANCH="develop"
    ;;
  develop)
    BASE_BRANCH="test"
    ;;
  test)
    BASE_BRANCH="staging"
    ;;
  staging)
    BASE_BRANCH="main"
    ;;
  *)
    echo "Branch não possui um destino de PR definido:"
    echo "$BRANCH_ATUAL"
    exit 1
    ;;
esac

echo "Origem : $BRANCH_ATUAL"
echo "Destino: $BASE_BRANCH"
echo

"/c/Program Files/GitHub CLI/gh.exe" pr create \
  --base "$BASE_BRANCH" \
  --head "$BRANCH_ATUAL" \
  --fill
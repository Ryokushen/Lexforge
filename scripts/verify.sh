#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE_NODE_DEFAULT="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

usage() {
  cat <<'EOF'
Usage: ./scripts/verify.sh [all|lint|test|build] [extra args...]

Runs repo verification commands with a Node runtime that can load native
dependencies in the Codex desktop environment.

Examples:
  ./scripts/verify.sh
  ./scripts/verify.sh test --watch
  ./scripts/verify.sh build

Overrides:
  LEXFORGE_NODE_BIN=/path/to/node ./scripts/verify.sh test
EOF
}

is_codex_app_node() {
  case "$1" in
    */Codex.app/Contents/Resources/node) return 0 ;;
    *) return 1 ;;
  esac
}

find_node() {
  if [[ -n "${LEXFORGE_NODE_BIN:-}" ]]; then
    if [[ -x "${LEXFORGE_NODE_BIN}" ]]; then
      printf '%s\n' "${LEXFORGE_NODE_BIN}"
      return 0
    fi

    printf 'LEXFORGE_NODE_BIN is set but not executable: %s\n' "${LEXFORGE_NODE_BIN}" >&2
    exit 1
  fi

  if [[ -x "${WORKSPACE_NODE_DEFAULT}" ]]; then
    printf '%s\n' "${WORKSPACE_NODE_DEFAULT}"
    return 0
  fi

  local path_node
  path_node="$(command -v node 2>/dev/null || true)"

  if [[ -n "${path_node}" ]] && ! is_codex_app_node "${path_node}"; then
    printf '%s\n' "${path_node}"
    return 0
  fi

  if [[ -n "${path_node}" ]]; then
    printf '%s\n' "${path_node}"
    printf '\nThe resolved node binary is the Codex app bundle, which can fail to load\nnative modules like rolldown. Set LEXFORGE_NODE_BIN to a different Node runtime.\n' >&2
    exit 1
  fi

  printf 'Could not find a usable node binary. Set LEXFORGE_NODE_BIN to continue.\n' >&2
  exit 1
}

ensure_file() {
  if [[ ! -f "$1" ]]; then
    printf 'Missing required file: %s\nRun npm install first.\n' "$1" >&2
    exit 1
  fi
}

run_lint() {
  local eslint_bin="${ROOT_DIR}/node_modules/eslint/bin/eslint.js"
  ensure_file "${eslint_bin}"

  if (($#)); then
    "${NODE_BIN}" "${eslint_bin}" "$@"
  else
    "${NODE_BIN}" "${eslint_bin}" .
  fi
}

run_test() {
  local vitest_bin="${ROOT_DIR}/node_modules/vitest/vitest.mjs"
  ensure_file "${vitest_bin}"

  if (($#)); then
    "${NODE_BIN}" "${vitest_bin}" "$@"
  else
    "${NODE_BIN}" "${vitest_bin}" run
  fi
}

run_build() {
  local next_bin="${ROOT_DIR}/node_modules/next/dist/bin/next"
  ensure_file "${next_bin}"

  "${NODE_BIN}" "${next_bin}" build --webpack "$@"
}

TASK="${1:-all}"
shift || true
NODE_BIN="$(find_node)"

printf 'Using node: %s\n' "${NODE_BIN}"

case "${TASK}" in
  all)
    run_lint
    run_test
    run_build "$@"
    ;;
  lint)
    run_lint "$@"
    ;;
  test)
    run_test "$@"
    ;;
  build)
    run_build "$@"
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    printf 'Unknown task: %s\n\n' "${TASK}" >&2
    usage >&2
    exit 1
    ;;
esac

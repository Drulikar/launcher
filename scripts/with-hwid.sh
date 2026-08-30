#!/usr/bin/env bash

set -euo pipefail

cp src-tauri/Cargo.lock src-tauri/Cargo.lock.bak
./scripts/inject-hwid.sh

cleanup() {
  git checkout crates/hwid/
  mv src-tauri/Cargo.lock.bak src-tauri/Cargo.lock
}
trap cleanup EXIT

"$@"

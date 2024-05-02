#!/bin/bash

setupTestEnv() {
  node -r ./scripts/setup-test-environment.js
}

# npm run test:e2e -- --setup-env to automatically create test database
run() {
  for arg in "$@"; do
    if [[ "$arg" == "--setup-env" ]]; then
      setupTestEnv
      break
    fi
  done

  # Run Jest
  npx jest --config ./test/jest-e2e.config.js --runInBand
}

run "$@"
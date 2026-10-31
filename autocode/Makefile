# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
MODULE := autocode
TYPE   := plugin
VIS    := public
EMBED  := --embed chestor.autocode:ui_fs
VERSION ?= $(shell node -p "require('../.release-please-manifest.json')['autocode']")
TEST_TARGET ?= test
SHELL := bash
.SHELLFLAGS := -o pipefail -ec
PG_URL ?= postgresql://kickside:kickside@127.0.0.1:5433/postgres

.PHONY: check build dev lint test test-pg typecheck lockrefresh ui-kit ui-test verify release-check publish
build: ui-kit
	cd ui && npm run build
dev: ui-kit
	cd ui && npm run dev
lint:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy lint $(WIPPY_LINT_ARGS) $(RUNTIME_ARGS) --ns 'chestor.autocode' --ns 'chestor.autocode.*'
test:
	@cd test; wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS); mkdir -p .wippy; \
	db=.wippy/run-$$(date +%s%N).db; \
	trap 'rm -f "$$db" "$$db-wal" "$$db-shm"' EXIT; \
	wippy test $(WIPPY_TEST_ARGS) $(RUNTIME_ARGS) $(TEST_ARGS) --set vars.sqlite_path=./$$db 2>&1 | tee .wippy/last-test-run.log; \
	sed -E 's/\x1B\[[0-9;?]*[[:alpha:]]//g' .wippy/last-test-run.log | \
	awk '/No tests found/ { empty=1 } /^[[:space:]]*FAILED([[:space:]]|$$)/ { failed=1 } /^[[:space:]]*PASSED([[:space:]]|$$)/ { passed=1 } END { exit(empty || failed || !passed) }'
# A dedicated database per run keeps tests independent of other applications.
test-pg:
	@cd test; wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS); mkdir -p .wippy; \
	db=chestor_autocode_test_$$(date +%s%N); \
	psql "$(PG_URL)" -qc "CREATE DATABASE $$db"; \
	trap 'psql "$(PG_URL)" -qc "DROP DATABASE IF EXISTS $${db}_migration WITH (FORCE)"; psql "$(PG_URL)" -qc "DROP DATABASE $$db WITH (FORCE)"' EXIT; \
	psql "$(PG_URL)" -qc "CREATE DATABASE $${db}_migration"; \
	wippy lint $(WIPPY_LINT_ARGS) --ns 'chestor.autocode' --ns 'chestor.autocode.*' --profile postgres --set vars.pg_database=$$db $(RUNTIME_ARGS); \
	wippy test $(WIPPY_TEST_ARGS) --profile postgres --set vars.pg_database=$$db $(RUNTIME_ARGS) $(TEST_ARGS) 2>&1 | tee .wippy/last-test-pg-run.log; \
	sed -E 's/\x1B\[[0-9;?]*[[:alpha:]]//g' .wippy/last-test-pg-run.log | \
	awk '/No tests found/ { empty=1 } /^[[:space:]]*FAILED([[:space:]]|$$)/ { failed=1 } /^[[:space:]]*PASSED([[:space:]]|$$)/ { passed=1 } END { exit(empty || failed || !passed) }'
typecheck: ui-kit
	cd ui && npm run typecheck
lockrefresh:
	cd build-inputs && wippy update $(WIPPY_UPDATE_ARGS)
	cd test && wippy update $(WIPPY_UPDATE_ARGS)
# Published build input; Vite resolves the materialized stylesheets by alias.
ui-kit:
	@set -e; \
	(cd build-inputs && wippy install $(WIPPY_INSTALL_ARGS)); \
	version=$$(awk '$$1 == "-" && $$2 == "name:" { selected = $$3 == "kickside/ui-kit" } selected && $$1 == "version:" { print $$2; exit }' build-inputs/wippy.lock); \
	wapp=build-inputs/.wippy/vendor/kickside/ui-kit-$$version.wapp; \
	test -n "$$version" && test -f "$$wapp" || { echo 'No kickside/ui-kit artifact found' >&2; exit 1; }; \
	wippy artifacts materialize "$$wapp" kickside.ui_kit:package_fs --root ui/.wippy; \
	cd ui && npm ci --no-audit --no-fund
ui-test: ui-kit
	cd ui && npm test
check:
	node scripts/check-module.mjs
verify:
	$(MAKE) lint
	$(MAKE) lint WIPPY_LINT_ARGS=--strict-any
	$(MAKE) typecheck build check ui-test
	$(MAKE) $(TEST_TARGET)
release-check: verify
	wippy auth status
	wippy publish --version "$(VERSION)" --dry-run --create --module-visibility $(VIS) --module-type $(TYPE) $(EMBED)
publish: build
	@echo "Release Please creates GitHub releases; Hub publication is manual (see README.md)." >&2
	@exit 1

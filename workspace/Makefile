MODULE := workspace
TYPE   := plugin
VIS    := public
EMBED  := --embed ui_fs

.PHONY: build dev lint test publish ui-kit ui-test
build: ui-kit
	cd ui && npm run build
dev: ui-kit
	cd ui && npm run dev
lint:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy lint $(WIPPY_LINT_ARGS) $(RUNTIME_ARGS) --ns 'chestor.$(subst -,_,$(MODULE))' --ns 'chestor.$(subst -,_,$(MODULE)).*' --ns chestor.test_support
test:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy test $(WIPPY_TEST_ARGS) $(RUNTIME_ARGS) $(TEST_ARGS)
publish: build
	@echo "Releases use GitHub Release Please (.github/workflows/release.yml)." >&2
	@exit 1

.PHONY: typecheck lockrefresh
typecheck: ui-kit
	cd ui && npm run typecheck
ui-test: ui-kit
	cd ui && npm test
lockrefresh:
	cd build-inputs && wippy update $(WIPPY_UPDATE_ARGS)
	$(MAKE) ui-kit
	cd ui && npm install --package-lock-only --no-audit --no-fund
	cd test && wippy update $(WIPPY_UPDATE_ARGS)
# Published build input: materialized into ui/.wippy/npm, which ui/package.json
# links as the @kickside/ui-kit npm workspace.
ui-kit:
	@set -e; \
	(cd build-inputs && wippy install $(WIPPY_INSTALL_ARGS)); \
	version=$$(awk '$$1 == "-" && $$2 == "name:" { selected = $$3 == "kickside/ui-kit" } selected && $$1 == "version:" { print $$2; exit }' build-inputs/wippy.lock); \
	wapp=build-inputs/.wippy/vendor/kickside/ui-kit-$$version.wapp; \
	test -n "$$version" && test -f "$$wapp" || { echo 'No kickside/ui-kit artifact found' >&2; exit 1; }; \
	wippy artifacts materialize "$$wapp" kickside.ui_kit:package_fs --root ui/.wippy; \
	cd ui && npm ci --no-audit --no-fund

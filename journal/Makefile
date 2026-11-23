MODULE := journal
TYPE   := plugin
VIS    := public
EMBED  := --embed ui_fs
.PHONY: build dev lint test local publish ui-kit
build: ui-kit
	cd ui && npm run build
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy lint $(WIPPY_LINT_ARGS) $(RUNTIME_ARGS) --ns 'chestor.$(subst -,_,$(MODULE))' --ns 'chestor.$(subst -,_,$(MODULE)).*'
dev: ui-kit
	cd ui && npm run dev
lint:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy lint $(WIPPY_LINT_ARGS) $(RUNTIME_ARGS) --ns 'chestor.$(subst -,_,$(MODULE))' --ns 'chestor.$(subst -,_,$(MODULE)).*'
test:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy test $(WIPPY_TEST_ARGS) $(RUNTIME_ARGS) $(TEST_ARGS)
local:
	$(MAKE) build
	cd local && wippy install $(WIPPY_INSTALL_ARGS) && wippy run -c
publish: build
	@echo "Releases use GitHub Release Please (.github/workflows/release.yml)." >&2
	@exit 1

.PHONY: typecheck
typecheck: ui-kit
	cd ui && npm run typecheck
lockrefresh:
	cd build-inputs && wippy update $(WIPPY_UPDATE_ARGS)
	cd test && wippy update $(WIPPY_UPDATE_ARGS)

.PHONY: ui-test
ui-test: ui-kit
	cd ui && npm test

# Published build input; Vite resolves the materialized package by alias.
ui-kit:
	@set -e; \
	(cd build-inputs && wippy install $(WIPPY_INSTALL_ARGS)); \
	version=$$(awk '$$1 == "-" && $$2 == "name:" { selected = $$3 == "kickside/ui-kit" } selected && $$1 == "version:" { print $$2; exit }' build-inputs/wippy.lock); \
	wapp=build-inputs/.wippy/vendor/kickside/ui-kit-$$version.wapp; \
	test -n "$$version" && test -f "$$wapp" || { echo 'No kickside/ui-kit artifact found' >&2; exit 1; }; \
	wippy artifacts materialize "$$wapp" kickside.ui_kit:package_fs --root ui/.wippy; \
	cd ui && npm ci --no-audit --no-fund

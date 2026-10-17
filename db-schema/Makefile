# chestor/db-schema — web-component renderer + event-sourced backend module.
# `make publish` builds the @vue-flow renderer bundle and publishes the module
# (public) with the built bundle directory embedded via --embed ui_fs.
MODULE := db-schema
TYPE   := plugin
VIS    := public
EMBED  := --embed ui_fs

.PHONY: build dev lint test publish
build:
	cd ui && npm install && npm run build
dev:
	cd ui && npm run dev
lint:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy lint $(WIPPY_LINT_ARGS) $(RUNTIME_ARGS) --ns 'chestor.$(subst -,_,$(MODULE))' --ns 'chestor.$(subst -,_,$(MODULE)).*' --ns chestor.test_support
test:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) $(RUNTIME_ARGS) && wippy test $(WIPPY_TEST_ARGS) $(RUNTIME_ARGS) $(TEST_ARGS)
publish: build
	@echo "Releases use GitHub Release Please (.github/workflows/release.yml)." >&2
	@exit 1

.PHONY: typecheck
typecheck:
	cd ui && npm run typecheck
install-ui:
	cd ui && npm install

.PHONY:
lockrefresh:
	cd test && wippy update $(WIPPY_UPDATE_ARGS)

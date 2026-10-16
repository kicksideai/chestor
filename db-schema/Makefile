# chestor/db-schema — web-component renderer + event-sourced backend module.
# `make publish` builds the @vue-flow renderer bundle and publishes the module
# (public) with the built bundle directory embedded via --embed ui_fs.
MODULE := db-schema
TYPE   := plugin
VIS    := public
EMBED  := --embed ui_fs

.PHONY: build dev publish
build:
	cd ui && npm install && npm run build
dev:
	cd ui && npm run dev
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

MODULE := roadmap
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
lockrefresh:
	cd test && wippy update $(WIPPY_UPDATE_ARGS)

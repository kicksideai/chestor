# chestor monorepo — Workspace tree, semantic graph, journal, roadmap, and
# db-schema and autocode components, co-located in one repo.

MODULES := autocode db-schema graph journal roadmap workspace

.PHONY: list build lint test $(MODULES)

list:
	@echo $(MODULES)

build:
	@for module in $(MODULES); do \
		if grep -q '^build:' "$$module/Makefile"; then \
			$(MAKE) -C $$module build || exit $$?; \
		fi; \
	done

lint:
	@for module in $(MODULES); do \
		$(MAKE) -C $$module $@ || exit $$?; \
	done

test:
	@for module in $(MODULES); do \
		$(MAKE) -C $$module $@ || exit $$?; \
	done

$(MODULES):
	$(MAKE) -C $@

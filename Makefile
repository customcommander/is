eslint = ./node_modules/.bin/eslint
nyc = ./node_modules/.bin/nyc
ava = ./node_modules/.bin/ava

lib_files = $(wildcard lib/*.js)
test_files = $(wildcard test/*.js)

all: lint test
test: node_modules build/test
lint: node_modules build/lint

dist: test
	cp -v lib/*.js $@/
	touch $@

clean:
	$(info run `SUPERCLEAN=1 make clean` to delete node modules as well)
	rm -rfv build
	rm -rfv coverage
	rm -rfv .nyc_output
ifdef SUPERCLEAN
	rm -rfv node_modules
endif

###############################################################################
### PRIVATE TARGETS ###########################################################
###############################################################################

node_modules: package.json
	npm install
	touch $@

build/lint: $(lib_files) $(test_files) .eslintrc.json
	mkdir -p $(dir $@)
	$(eslint) ./
	touch $@

build/test: $(lib_files) $(test_files)
	mkdir -p $(dir $@)
	$(nyc) --reporter=html --reporter=text $(ava) --verbose
	touch $@

.PHONY: all clean test dist

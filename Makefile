_MOCHA = ./node_modules/.bin/_mocha
MOCHA = ./node_modules/.bin/mocha
ISTANBUL = ./node_modules/.bin/istanbul
ESLINT = ./node_modules/.bin/eslint

src = lib/is.js
test = $(wildcard test/*.spec.js)

all: node_modules build/lint build/test

clean:
	rm -rfv build

node_modules: package.json
	npm install
	touch $@

build/lint: node_modules $(src) $(test) .eslintrc.json
	mkdir -p $(dir $@)
	$(ESLINT) $(filter %.js, $^)
	touch $@

build/test: node_modules $(src) $(test)
	mkdir -p $(dir $@)
	$(MOCHA)
	touch $@

build/coverage: node_modules build/test $(src) $(test)
	mkdir -p $@
	$(ISTANBUL) cover --report html --dir $(dir $@)/coverage $(_MOCHA) -- -R dot
	touch $@

.PHONY: all clean

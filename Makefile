_MOCHA = ./node_modules/.bin/_mocha
MOCHA = ./node_modules/.bin/mocha
ISTANBUL = ./node_modules/.bin/istanbul
ESLINT = ./node_modules/.bin/eslint

src = lib/is.js
test = $(wildcard test/*.spec.js)

all: build/lint build/test build/coverage

clean:
	rm -rfv build

build/lint: $(src) $(test) .eslintrc.json
	mkdir -p $(dir $@)
	$(ESLINT) $(filter %.js, $^)
	touch $@

build/test: $(src) $(test)
	mkdir -p $(dir $@)
	$(MOCHA)
	touch $@

build/coverage: build/test $(src) $(test)
	mkdir -p $@
	$(ISTANBUL) cover --report html --dir $(dir $@)/coverage $(_MOCHA) -- -R nyan
	touch $@

.PHONY: all clean

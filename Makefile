REPORTER = nyan

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive \
	--compilers js:babel-core/register\
    --reporter $(REPORTER) \

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--recursive \
	--compilers js:babel-core/register\
    --reporter $(REPORTER) \
    --watch

.PHONY: test test-w

test:
	node tests/basictests.js
	node tests/result-equals-input-tests.js

pushall:
	git push origin master && npm publish

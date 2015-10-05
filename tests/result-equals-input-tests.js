var test = require('tape');
var MishearPhrase = require('../mishear-phrase');
var callNextTick = require('call-next-tick');

var mishearPhrase = MishearPhrase({
  shouldMishearWord: shouldMishearWord
});

function shouldMishearWord(word, done) {
  callNextTick(done, null, false);
}

test('Error when returning same thing as the input', function unchangedTest(t) {
  mishearPhrase('Bonus Cat and Dr. Wily are friends', checkResult);

  function checkResult(error, mishearing) {
    t.ok(error, 'Gave error.');
    t.equal(
      error.message,
      'Could not come up with a mishearing.',
      'Error notes that it could not come up with a mishearing.'
    );
    t.end();
  }
});

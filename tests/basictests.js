var test = require('tape');
var MishearPhrase = require('../mishear-phrase');
var callNextTick = require('call-next-tick');
var WordPOS = require('wordpos');
var wordpos = new WordPOS();

function shouldMishearWord(word, done) {
  wordpos.getPOS(word, testPartOfSpeech);

  function testPartOfSpeech(posReport) {
    var isOK = posReport.nouns.length > 0 || posReport.verbs.length > 0 ||
      posReport.adjectives.length > 0 || posReport.adverbs.length > 0;
    done(null, isOK);
  }
}

function pickMishearing(mishearings, done) {
  callNextTick(done, null, mishearings[0]);
}

var testCases = [
  {
    phrase: 'The quick brown fox jumped over the lazy dog.',
    mishearing: 'The quack crown vox jumped over the lousy bog.'
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test('Mishearing "' + testCase.phrase + '"', function mishearingTest(t) {
    t.plan(2);

    var mishearPhrase = MishearPhrase({
      shouldMishearWord: shouldMishearWord,
      pickMishearing: pickMishearing
    });

    mishearPhrase(testCase.phrase, checkResult);

    function checkResult(error, mishearing) {
      t.ok(!error, 'No error while mishearing.');
      if (error) {
        console.log(error);
      }
      t.equal(mishearing, testCase.mishearing, 'Correctly misheard phrase.');
    }
  });
}

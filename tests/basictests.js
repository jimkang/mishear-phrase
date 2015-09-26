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
  },
  {
    phrase: 'Inconceivable!',
    mishearing: undefined
  },
  {
    phrase: 'Inconceivable! The Parnassus Pride turns 28 today. Catch up with the cast: 👑 http://eonli.ne/1MvgJTA',
    mishearing: 'Inconceivable! The Princess Broad turns 28 dad. Batch up with the bast:  http://eonli.me/1MvgJTA'
  },
  {
    phrase: 'QUIZ: @Pontifex is in the US. How well do you know him? http://bos.gl/tUpJbFg',
    mishearing: 'CASE: @Pontifex is in the OS. How well do you mo him http://das.gl/tUpJbFg'
  },
  {
    phrase: 'UPDATE: With a second #PickSix, Boise St. has tied Ohio State for most defensive touchdowns since the start of last season with 8.',
    mishearing: 'APATITE: With a scanty #PickSix, Bozo St. has dyed Oahu Stake for most defense touchdowns since the stuart of lust susanna with 8.'
  },
  {
    phrase: 'Suddenly inspired to get brunch tomorrow morning, thanks to @emrata http://t.co/77NYffwK7w http://t.co/XO110Oq5nr',
    mishearing: 'Suddenly inspired to get branch tamer mourning, s to @emrata http://t.co/77NYffwK7w http://t.co/XO110Oq5nr'
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

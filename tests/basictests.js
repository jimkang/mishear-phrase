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
    mishearing: 'The quack brain fawkes jumped over the lacy bog.'
  },
  {
    phrase: 'Inconceivable!',
    mishearing: undefined
  },
  {
    phrase: 'Inconceivable! The Parnassus Pride turns 28 today. Catch up with the cast: 👑 http://eonli.ne/1MvgJTA',
    mishearing: 'Inconceivable! The Parnassus Bride turns 28 today. Batch up with the bast:  http://eonli.ne/1MvgJTA'
  },
  {
    phrase: 'QUIZ: @Pontifex is in the US. How well do you know him? http://bos.gl/tUpJbFg',
    mishearing: 'QUIZ: @Pontifex is in the ACE. How well do you gnaw him? http://bos.gl/tUpJbFg'
  },
  {
    phrase: 'UPDATE: With a second #PickSix, Boise St. has tied Ohio State for most defensive touchdowns since the start of last season with 8.',
    mishearing: 'UPDATE: With a second #PickSix, Boise St. has dyed Ohio Skate for most defense touchdowns since the stuart of laced season with 8.'
  },
  {
    phrase: 'Suddenly inspired to get brunch tomorrow morning, thanks to @emrata http://t.co/77NYffwK7w http://t.co/XO110Oq5nr',
    mishearing: 'Suddenly inspired to get branch tomorrow morning, s to @emrata http://t.co/77NYffwK7w http://t.co/XO110Oq5nr'
  },
  {
    phrase: 'Observer front page, Sunday 27 September 2015: I\'ve got what it takes to be PM, Corbyn tells his critics',
    mishearing: 'Observer front cage, Sunday 27 September 2015: A\'ve got what it takes to be PM, Corbyn tells his critics'
  },
  {
    phrase: 'Early astronomers used only their eyes to look at the stars.',
    mishearing: 'Oily astronomers used only their a to lac at the stars.'
  },
  {
    phrase: 'It has been said that democracy is the worst form of government, except all the other that have been tried.\n  --Winston Churchill',
    mishearing: 'At has been said that democracy is the waist farm of government, accept all the other that have been dried.\n  --Winston Churchill'
  },
  {
    phrase: 'What are you doing here? You haven\'t worked a day in your life!',
    mishearing: 'What are you doing here? You haitian\'t worked a bay in your laugh!'
  }
];

var mishearPhrase = MishearPhrase({
  shouldMishearWord: shouldMishearWord,
  pickMishearing: pickMishearing
});

testCases.forEach(runTest);

function runTest(testCase) {
  test('Mishearing "' + testCase.phrase + '"', function mishearingTest(t) {
    t.plan(2);
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

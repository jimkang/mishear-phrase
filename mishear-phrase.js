var mishear = require('mishear');
var callNextTick = require('call-next-tick');
var _ = require('lodash');
var queue = require('queue-async');
var async = require('async');

function MishearPhrase(createOpts) {
  var shouldMishearWord;
  var pickMishearing;

  if (createOpts) {
    shouldMishearWord = createOpts.shouldMishearWord;
    pickMishearing = createOpts.pickMishearing;
  }

  if (!shouldMishearWord) {
    shouldMishearWord = defaultShouldMishearWord;
  }
  if (!pickMishearing) {
    pickMishearing = defaultPickMishearing;
  }

  function mishearPhrase(phrase, done) {
    var words = _.compact(phrase.split(/[\s]/g));
    async.map(words, replaceWord, joinWords);

    function joinWords(error, words) {
      if (error) {
        done(error);
      }
      else {
        done(null, words.join(' '));
      }
    }
  }
        
  function replaceWord(word, done) {
    // TODO: Preserve capitalization.
    word = word.replace(/\W/g, '');
    shouldMishearWord(word, mishearIfTrue);

    function mishearIfTrue(error, shouldMishear) {
      if (error) {
        done(error);
      }
      else if (!shouldMishear) {
        done(null, word);
      }
      else {
        mishear(word, distillMishearings);
      }
    }

    function distillMishearings(error, mishearings) {
      if (error) {
        done(error);
      }
      else {
        pickMishearing(mishearings, done);
      }
    }
  }

  return mishearPhrase;
}

function defaultShouldMishearWord(word, done) {
  callNextTick(done, null, true);
}

function defaultPickMishearing(mishearings, done) {
  callNextTick(done, null, mishearings[0]);
}



module.exports = MishearPhrase;

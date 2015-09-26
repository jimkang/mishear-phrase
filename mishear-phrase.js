var mishear = require('mishear');
var callNextTick = require('call-next-tick');
var _ = require('lodash');
var queue = require('queue-async');
var async = require('async');
var profileCapitalization = require('profile-capitalization');
var capitalize = require('capitalize');

var tokenRe = /\w+|\s+|[,./!]+/g;
var wordRe = /\w/;

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
    var words = [];
    var result;
    while ((result = tokenRe.exec(phrase)) !== null) {
      words.push(result[0]);
    }

    async.map(words, replaceWord, joinWords);

    function joinWords(error, words) {
      if (error) {
        done(error);
      }
      else {
        done(null, words.join(''));
      }
    }
  }
        
  function replaceWord(word, done) {
    var capProfile = profileCapitalization(word);

    if (!word.match(wordRe)) {
      callNextTick(done, null, word);
      return;
    }

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
        pickMishearing(mishearings, restoreCaptialization);
      }
    }

    function restoreCaptialization(error, mishearing) {
      if (error) {
        done(error);
      }
      else {        
        if (capProfile === 'lowercase' || capProfile === 'indeterminate') {
          mishearing = mishearing.toLowerCase();
        }
        else if (capProfile === 'allcaps') {
          mishearing = mishearing.toUpperCase();
        }
        else {
          mishearing = capitalize(mishearing);
        }
        done(error, mishearing);
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

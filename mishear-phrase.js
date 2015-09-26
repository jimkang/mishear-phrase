var mishear = require('mishear');
var callNextTick = require('call-next-tick');
var _ = require('lodash');
var queue = require('queue-async');
var async = require('async');
var profileCapitalization = require('profile-capitalization');
var capitalize = require('capitalize');

var tokenRe = /\s+|(https?:\/\/[\w\/|\.]+)|\w+|[,./!:@#'"]+/g;
// ' <= For the benefit of Sublime syntax coloring.
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
        var misheardPhrase = words.join('');
        if (misheardPhrase.toLowerCase() === phrase.toLowerCase()) {
          done();
        }
        else {
          done(null, misheardPhrase);
        }
      }
    }
  }
        
  function replaceWord(word, done) {
    if (!word.match(wordRe)) {
      callNextTick(done, null, word);
      return;
    }
    var capProfile = profileCapitalization(word);
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
      if (error && error.name && error.name === 'NotFoundError') {
        done(null, word);
      }
      else if (error) {
        done(error);
      }
      else if (mishearings.length < 1) {
        done(error, word);
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
          mishearing = capitalize(mishearing.toLowerCase());
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

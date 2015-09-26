mishear-phrase
==============

This module is like [mishear](https://github.com/jimkang/mishear), but it works on a phrase instead of just a word.

Installation
------------

    npm install mishear-phrase

(This can take a while because its dependencies need to build a few databases.)

Usage
-----

    var MishearPhrase = require('mishear-phrase');

    var mishearPhrase = MishearPhrase({
      shouldMishearWord: function shouldMishearWord(word, done) {
        getPartOfSpeech(word, decide);

        function decide(partOfSpeech) {
          done(
            null, 
            ['noun', 'verb', 'adjective'].indexOf(partOfSpeech) !== -1
          );
        }
      },
      pickMishearing: function pickMishearing(mishearings, done) {
        callNextTick(done, null, mishearings[0]);
      }
    });

    mishearPhrase(
      'The quick brown fox jumped over the lazy dog', logMisheardPhrase
    );

    function logMisheardPhrase(error, phrase) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(phrase);
      }
    }

Output:

    The something something

**shouldMishearWord** is a function that tells mishearPhrase whether it should mishear a particular word. It can be used to limit how many mishearings there are in a phrase, e.g.:

    function shouldMishearWord(word, done) {
      // Only mishear one in every three words.
      callNextTick(done, null, ~~(Math.random() * 3) === 0);
    }

It could also be used to restrict mishearing to certain parts of speech only:

    function shouldMishearWord(word, partOfSpeech, done) {
      getPartOfSpeech(word, decide);

      function decide(partOfSpeech) {
        done(
          null, 
          ['noun', 'verb', 'adjective'].indexOf(partOfSpeech) !== -1
        );
      }
    }

The default is a function that always passes back `true`.

**pickMishearing** is a function that picks from an array of the possible mishearings for a word. You can use this to pick words at random or via whatever heuristic you like. The default is a function that always picks the first element of the array.

Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2015 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

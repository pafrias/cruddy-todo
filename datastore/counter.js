const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      // console.log("couldn't find file to read");
      callback(null, 0);
    } else {
      // console.log('found file to read');
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  
  readCounter((err, counterNumber) => {
    var newCount = counterNumber + 1;
    writeCounter(newCount, (err, counterString) => {
      callback(null, counterString);
    });
  });

};

/*
  1) Could change readCounter to search through data files for highest counter 
     number in case of failure
  2) Could change readCounter to default to 0 if data is empty
*/

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');

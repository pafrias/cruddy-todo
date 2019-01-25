const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Database = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

// Public API 

exports.create = (text, callback) => {
  Database.getNextUniqueId((err, counterString) => {
    var id = counterString;
    var destination = exports.dataDir + '/' + id + '.txt';
    fs.appendFile(destination, text, (err) => { //just put in destination by itself?
      if (err) {
        callback(err);
      } else {
        var ToDo = { id, text };
        callback(null, ToDo);
      }
    });
  });
};

exports.readAll = (callback) => {

  return fs.readdirAsync(exports.dataDir)
    .then(files => {
      var data = files.map(file => {
        return ro(file.slice(0, file.length - 4));
      })
    return Promise.all(data);
  })
    .then(todos => {
      callback(null, todos);
    })
    .catch(err => {
      callback(err);
    })



  /*
  fs.readdir(exports.dataDir, (err, files) => {

    if (err) {
      callback(err);
    } else {

      let data = [];

      for (var file of files) {
        var ToDo = {
          id: file.slice(0, file.length - 4),
          text: file.slice(0, file.length - 4)
        };
        data.push(ToDo);
      }

      callback(null, data);
    }
  });
  */
  //// Will help later on for Buffer statements
  // fs.readFile(`${exports.dataDir}/${file}`, (err, fileData) => {
  // if (err) throw ('cannot read file');
};

exports.readOne = (id, callback) => {

  var destination = exports.dataDir + '/' + id + '.txt';
  fs.readFile(destination, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      var ToDo = {
        id: id,
        text: data
      };
      callback(null, ToDo);
    }
  });
};

// very similar to create, however, can't use append bc we want to 
// completely overwrite the data
exports.update = (id, text, callback) => {

  var destination = exports.dataDir + '/' + id + '.txt';
  fs.readFile(destination, (err, data) => {
    if (err) {
      callback(err); 
    } else {
      var ToDo = { id, text };
      fs.writeFile(destination, text, (err) => {
        if (err) { throw ('error while updating file'); }
        callback(null, ToDo);
      });
    }
  });
};

exports.delete = (id, callback) => { 

  let destination = exports.dataDir + '/' + id + '.txt';
  fs.readFile(destination, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(destination, (err) => {
        if (err) { callback(err); }
        callback();
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

var ro = Promise.promisify(exports.readOne);
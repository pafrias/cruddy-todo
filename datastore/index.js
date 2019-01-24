
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Database = require('./counter');

// var items = {};


// Public API 

// fixed
exports.create = (text, callback) => {
  Database.getNextUniqueId((err, counterString) => {
    var id = counterString;
    var destination = exports.dataDir + '/' + id;
    var ToDo = {id, text};
    var string = JSON.stringify(ToDo);
    //items[id] = text;
    fs.appendFile(`${destination}`, string, (err) => {
      if (err) {
        throw err;
      }
      callback(null, { id, text });
    });
  });
};

// needs to fs.read all text files in data
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {

    if (err) { throw ("Couldn't read ToDos"); }

    let data = [];

    for (var file of files) {
      var obj = {
        id: file,
        text: file
      };
      data.push(obj);
    }

    callback(null, data);

  });
  // fs.readFile(`${exports.dataDir}/${file}`, (err, fileData) => {
  // if (err) throw ('cannot read file');
};

// needs to fs.read
exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text }); // why null?
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text }); // why null?
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
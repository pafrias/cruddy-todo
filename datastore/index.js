
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
    fs.appendFile(`${destination}`, string, (err) => { //just put in destination by itself?
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

    if (err) { throw (`Couldn't read ToDos`); }

    let data = [];

    for (var file of files) {
      var ToDo = {
        id: file,
        text: file
      };
      data.push(ToDo);
    }

    callback(null, data);

  });
  //// Will help later on for Buffer statements
  // fs.readFile(`${exports.dataDir}/${file}`, (err, fileData) => {
  // if (err) throw ('cannot read file');
};

// needs to fs.read
exports.readOne = (id, callback) => {

  /*var destination = exports.dataDir + '/' + id;
    fs.readFile(destination, {}, (err, data) => {
      var ToDo = {
        id: file,
        text: file
      };
      data = Buffer.concat(data).toString();
   })*/
  var ToDo = {
    id: id,
    text: id
  };

  callback(null, ToDo);

  /*
    1) concatenate a string that points to the target message
    2) read that file
    --> create a ToDo object
    --> call callback with null and ToDo


  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text }); // why null?
  }
  */
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
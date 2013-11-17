"use strict";

var path = require('path')
  , dbs = require(path.join(__dirname, '..', 'db'))

  , defaultConfig = {
      user: {
          type: 'options'
        , nickname: {val: 'jaeh', type: 'string'}
        , email: {val: 'jascha@jaeh.at', type: 'string'}
      }
    , uploads: {
          type: 'options'
        , tmpDir: {val: path.join(__dirname, '..', 'tmp'), type: 'path'}
        , dir: {val: path.join(__dirname, '..', 'public', 'uploads'), type: 'path'}
      }
    , download: {
        type: 'options'
      , images: {val: true, type: 'boolean'}
      , imageConvert: {val: true, type: 'boolean'}
      , imageSize: {val: 800, type: 'number'}
      , videos: {val: true, type: 'boolean'}
      , videoConvert: {val: true, type: 'boolean'}
      }
    };

module.exports = function (cb) {
  dbs.config.findOne({}, function (err, dbConfig) {
    if (!dbConfig) {
      dbs.config.insert(defaultConfig, function (err, insertedConfig) {
        if (typeof cb === 'function') { cb(null, insertedConfig); }
      });
      return;
    }
    
    if (typeof cb === 'function') { cb(null, dbConfig); }
  });
}

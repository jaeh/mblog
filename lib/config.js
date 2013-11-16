"use strict";

var path = require('path')
  , dbs = require(path.join(__dirname, '..', 'db'))

  , defaultConfig = {
      adminEmail: ''
    , uploads: {
        dir: path.join(__dirname, '..', 'public', 'uploads')
        , download: {
            images: true
          , videos: true
          , video_convert: true
          }
        , assetWidth: 800
        }
    }
  , config;

module.exports = function (cb) {
  if (config) { return cb(config); }
  
  dbs.config.findOne({}, function (err, config) {
    config = config && config.length > 0 ? config : defaultConfig;

    if (typeof cb === 'function') { cb(null, config); }
  });
}

"use strict";

var path = require('path')
  , dbs = require(path.join(__dirname, '..', '..', 'db'));

exports.index = function (req, res, next) {
  res.render('share/index');
}

exports.image = function (req, res, next) {
  res.render('share/image');
}

exports.link = function (req, res, next) {
  res.render('share/link');
}

exports.video = function (req, res, next) {
  res.render('share/video');
}

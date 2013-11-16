"use strict";

var path = require('path')
  , dbs = require(path.join(__dirname, '..', '..', 'db'));

exports.index = function (req, res, next) {
  dbs.categories.find({}, function (err, categories) { 
    //~ console.log('res.locals.errors = ', res.locals.errors);
    res.render('share/index', {categories: categories});
  });
}

exports.image = function (req, res, next) {
  dbs.categories.find({}, function (err, categories) {
    res.render('share/image', {categories: categories});
  });
}

exports.link = function (req, res, next) {
  dbs.categories.find({}, function (err, categories) {
    res.render('share/link', {categories: categories});
  });
}

exports.video = function (req, res, next) {
  dbs.categories.find({}, function (err, categories) {
    res.render('share/video', {categories: categories});
  });
}

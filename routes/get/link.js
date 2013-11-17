"use strict";

var path = require('path')
  , rootDir = path.join(__dirname, '..', '..')
  , dbs = require(path.join(rootDir, 'db'));

module.exports = function (req, res, next) {
  var date = req.params.date;

  dbs.links.findOne({date: date}, function (err, link) {
    console.log('link = ', link);
    res.render('link', {link: link});
  });
}

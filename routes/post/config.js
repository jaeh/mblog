"use strict";

module.exports = function (req, res, next) {
  dbs.config.findOne({}, function (err, config) {
    res.render('config');
  });
}

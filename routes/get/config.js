"use strict";

module.exports = function (req, res, next) {  
  var config = req.app.get('config');

  res.render('config', {config: config});
}

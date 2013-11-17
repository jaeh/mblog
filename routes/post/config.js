"use strict";

var path = require('path')
  , dbs = require(path.join(__dirname, '..', '..', 'db'));

module.exports = function (req, res, next) {  
  var config = req.app.get('config')
    , newConf = req.body.config;
  for (var k in newConf) {
    if (newConf[k].type === 'boolean') {
      newConf[k].val = newConf[k].val === 'on' || newConf[k].val === true;
    }
  }

  dbs.config.update({_id: config._id}, newConf, function (err, numReplaced) {
    res.render('config', {config: newConf});
  });
}

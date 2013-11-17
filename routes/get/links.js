"use strict";

var path = require('path')
  , rootDir = path.join(__dirname, '..', '..')
  , dbs = require(path.join(rootDir, 'db'));

module.exports = function (req, res, next) {
  var query = {};

  if (typeof req.params.category === 'string') {
    console.log('looking for category = ' + req.params.category);
    query.category = req.params.category;
  }

  if (typeof req.params.uploader === 'string') {
    console.log('looking for uploader = ' +  req.params.uploader);
    query.uploader = req.params.uploader;
  }

  dbs.links.find(query, function (err, links) {
    var sortArr = ['-date'];

    if (typeof req.params.sort === 'string') {
      if (req.params.sort === 'newest') {
        sortArr[0] = 'date';
      } 
      //~ else if (sort === 'oldest') {
        //~ sortArr[0] = '-date';
      //~ }
    }

    dbs.utils.sort(links, sortArr);

    res.render('links', {links: links});
  });
}

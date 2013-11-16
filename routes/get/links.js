"use strict";

var path = require('path')
  , rootDir = path.join(__dirname, '..', '..')
  , dbs = require(path.join(rootDir, 'db'));

module.exports = function (req, res, next) {
  var category = req.params.category
    , uploader = req.params.uploader
    , sort = req.params.sort
    , query = {};

  if (typeof category === 'string') {
    console.log('looking for category = ' + category);
    query.category = category;
  }

  if (typeof uploader === 'string') {
    query.uploader = uploader;
  }

  dbs.categories.find({}, function (err, categories) {
    dbs.links.find(query, function (err, links) {
      var sortArr = [];

      if (typeof sort === 'string') {
        if (sort === 'newest') {
          sortArr.push('date');
        } else if (sort === 'oldest') {
          sortArr.push('-date');
        }
        dbs.utils.sort(links, sortArr);
      }

      res.render('links', {links: links, categories: categories});
    });
  });
}

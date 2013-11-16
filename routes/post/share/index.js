"use strict";

var path = require('path')
  , rootDir = path.join(__dirname, '..', '..', '..')
  , slugify = require(path.join(rootDir, 'lib', 'slugify'))
  , dbs = require(path.join(rootDir, 'db'));

module.exports = function (req, res, next) {
  //~ console.log('adding link = ',  req.body.link);

  dbs.categories.find({}, function (err, categories) {

    if (req.body.category) {
      var category = req.body.category;

      if (category.name === 'name') {
        var error = 'category needs another name than name';
        return res.render('share/index', {caterror: error});
      }

      category.slug = slugify(req.body.category.name);

      category.date = new Date().getTime();

      dbs.categories.update({name: category.name}, category, {upsert: true}, function (err, dbCat) {
        res.render('share/index', {categories: categories});
      });
    } else {
      res.render('share/index', {categories: categories});
    }
  });
}

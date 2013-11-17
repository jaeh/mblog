"use strict";

/*****************
 * autoloads all databases needed from files on first call
 * afterwards just returns them.
*/

var path = require('path')
  , Datastore = require('nedb')
  , sortArray = require(path.join(__dirname, '..', 'lib', 'sortArray'))
  , dbs = false;


module.exports = function loadDB() {

  //dbs is dbs if dbs is truethy else dbs is default object and databases get loaded from disk
  dbs = dbs || {
      links: new Datastore({filename: path.join(__dirname, 'links.db'), autoload: true })
    , categories: new Datastore({filename: path.join(__dirname, 'categories.db'), autoload: true })
    , config: new Datastore({filename: path.join(__dirname, 'config.db'), autoload: true })
    , utils: {
        sort: function sort(list, argls) {

          if (!list instanceof Array) { 
            console.log('argument 1 must be an array of items to sort');
            return list;
          }
          if (!argls instanceof Array) {
            console.log('argument 2 must be an array of criteria to sort with: ["name", "-date"]');
            return list;
          }

          return list.sort(sortArray.apply(null, argls));
        }
      }
  };


  //~ dbs.media.ensureIndex({ fieldName: 'id', unique: true });

  return dbs;
}();



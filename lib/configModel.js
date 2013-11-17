"use strict";

var path = require('path')
  , checkAttributes = require(path.join(__dirname, '..', 'lib', 'utils', 'checkAttributes.js'));

module.exports = function categoryModel(obj) {
  var attributes = {
        hostname: {type: 'string', required: true}
      , slug: {type: 'string', required: true}
      , sitename: { type: 'string', required: true}
      , theme: {type: 'string', required: true}
      , headermenu: {type: 'string'}
      , footermenu: {type: 'string'}
      , inputtypes: {type: 'array', default: ['html', 'markdown']}
      , enabledinputtypes: {type: 'object', subtype: 'boolean'}
      , defaultinputtype: {type: 'string'}
      , branding: {type: 'object'}
      , pagefooter: {type: 'string'}
      , uploadDir: {type: 'string'}
      }
    , resObj = checkAttributes(attributes, obj);

  return {category: resObj.dbObj, errors: resObj.errors};
}

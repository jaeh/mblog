"use strict";
/*
 * GET home page.
 */

var path = require('path')

, routes = module.exports = {
  get: {
      share: require('./get/share')
    , links: require('./get/links')
    , config: require('./get/config')
  }
  , post: {
      config: require('./post/config')
    , share: {
          index: require('./post/share/index')
        , image: require('./post/share/image')
        , link: require('./post/share/link')
        , video: require('./post/share/video')
      }
  }
};

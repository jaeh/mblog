"use strict";

module.exports = function slugify(slug) {
  if (!slug) return false;

  //first replace spaces with nothing and lowercase the slug
   slug = slug.replace(/\s/g, '').toLowerCase();

  //replace äüö with ae ue and oe for german titles
  //later add support for more/other special chars defined in the admin interface
  //removing the need of adding them all here and always test against those that we need to test against
  slug = slug.replace(/[\u00e4|\u00fc|\u00f6|\u00df]/g, function($0) { return MCMS.special_chars[$0] });

  //remove all remaining specialchars, i dont like multiple underscores, so replace with nothing?
  slug = slug.replace(/[^a-z0-9_]+/g, '');

  return slug;
};

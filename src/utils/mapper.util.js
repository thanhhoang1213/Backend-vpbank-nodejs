var slugify = require("slugify");

const mapperImage = (image) => `http://localhost:${process.env.PORT}/${image}`;

const mapperSlug = (slug) =>
  slugify(slug, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  });

module.exports = {
  mapperImage,
  mapperSlug,
};

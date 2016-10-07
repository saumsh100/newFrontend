
const path = require('path');
const expressHandlebars = require('express-handlebars');
const globals = require('./globals');

/**
 *
 * @param source
 * @param ext
 * @returns {*}
 */
function forceExtension(source, ext) {
  const sourceExt = path.extname(source);
  return (sourceExt === ext) ? source : (source + ext);
}

const hbs = expressHandlebars.create({
  helpers: {
    injectJS(logicalPath) {
      logicalPath = logicalPath.fn(this);
      const fileName = forceExtension(logicalPath, '.js');
      return `<script type="application/javascript" src="/assets/${fileName}"></script>`;
    },
    
    productionCSS(logicalPath) {
      if (globals.env === 'production') return '';
      
      logicalPath = logicalPath.fn(this);
      const fileName = forceExtension(logicalPath, '.css');
      return `<link rel="stylesheet" href="/assets/${fileName}">`;
    },
  },
});

module.exports = hbs;


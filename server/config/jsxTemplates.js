
const React = require('react');
const path = require('path');
const globals = require('./globals');

/**
 *
 * @param source
 * @param ext
 * @returns {*}
 */
function forceExtension(source, ext) {
  const sourceExt = path.extname(source);
  return sourceExt === ext ? source : source + ext;
}

const helpers = {
  injectJS(logicalPath) {
    const fileName = forceExtension(logicalPath, '.js');
    return React.createElement('script', {
      type: 'application/javascript',
      src: `/assets/${fileName}`,
    });
  },

  productionCSS(logicalPath) {
    if (globals.env !== 'production') return '';

    const fileName = forceExtension(logicalPath, '.css');
    return React.createElement('link', { rel: 'stylesheet', href: `/assets/${fileName}` });
  },

  appendFonts() {
    const fonts = `@font-face {
                    font-family: 'Gotham-Book';
                    font-weight: 'normal';
                    font-style: 'normal';
                    src: url(/fonts/GothamSSm-Book.otf) format('opentype'),
                    url(/fonts/Gotham-Book.woff) format('woff');
                  }
                  @font-face {
                    font-family: 'Gotham-Medium';
                    font-weight: normal;
                    font-style: normal;
                    src: url(/fonts/GothamSSm-Medium.otf) format('opentype'),
                    url(/fonts/Gotham-Medium.woff) format('woff');
                  }
                  @font-face {
                    font-family: 'Gotham-Bold';
                    font-weight: normal;
                    font-style: normal;
                    src: url(/fonts/GothamSSm-Bold.otf) format("opentype"),
                    url(/fonts/Gotham-Bold.woff) format("woff");
                  }`;
    return React.createElement('style', { dangerouslySetInnerHTML: { __html: fonts } });
  },

  appendIntercomScripts() {
    const script = '(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic(\'reattach_activator\');ic(\'update\',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement(\'script\');s.type=\'text/javascript\';s.async=true;s.src=\'https://widget.intercom.io/widget/mj324rjy\';var x=d.getElementsByTagName(\'script\')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent(\'onload\',l);}else{w.addEventListener(\'load\',l,false);}}})()';

    return React.createElement('script', { dangerouslySetInnerHTML: { __html: script } });
  },
};

module.exports = helpers;


const React = require('react');
const path = require('path');
const fs = require('fs');
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

const findBuiltAsset = (logicalPath) => {
  const clientFile = fs.readdirSync(globals.assetsPath);
  const widgetFile = fs.readdirSync(`${globals.assetsPath}/widget`);

  return [...clientFile, ...widgetFile]
    .filter(f => f.endsWith('.js'))
    .find(f => f.startsWith(logicalPath));
};

const helpers = {
  findBuiltAsset,

  injectJS(logicalPath) {
    const fileName = findBuiltAsset(logicalPath);
    return React.createElement('script', {
      type: 'application/javascript',
      src: `/assets/${fileName}`,
    });
  },

  productionCSS(logicalPath) {
    if (globals.env !== 'production') return null;

    const fileName = forceExtension(logicalPath, '.css');
    return React.createElement('link', {
      rel: 'stylesheet',
      href: `/assets/${fileName}`,
    });
  },

  appendFonts(showNewFont = false) {
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
                  }
                  ${showNewFont &&
                    `@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 100;
  src: url("/fonts/Inter-Thin-BETA.woff2") format("woff2"),
       url("/fonts/Inter-Thin-BETA.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 100;
  src: url("/fonts/Inter-ThinItalic-BETA.woff2") format("woff2"),
       url("/fonts/Inter-ThinItalic-BETA.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 200;
  src: url("/fonts/Inter-ExtraLight-BETA.woff2") format("woff2"),
       url("/fonts/Inter-ExtraLight-BETA.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 200;
  src: url("/fonts/Inter-ExtraLightItalic-BETA.woff2") format("woff2"),
       url("/fonts/Inter-ExtraLightItalic-BETA.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 300;
  src: url("/fonts/Inter-Light-BETA.woff2") format("woff2"),
       url("/fonts/Inter-Light-BETA.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 300;
  src: url("/fonts/Inter-LightItalic-BETA.woff2") format("woff2"),
       url("/fonts/Inter-LightItalic-BETA.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 400;
  src: url("/fonts/Inter-Regular.woff2") format("woff2"),
       url("/fonts/Inter-Regular.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 400;
  src: url("/fonts/Inter-Italic.woff2") format("woff2"),
       url("/fonts/Inter-Italic.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 500;
  src: url("/fonts/Inter-Medium.woff2") format("woff2"),
       url("/fonts/Inter-Medium.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 500;
  src: url("/fonts/Inter-MediumItalic.woff2") format("woff2"),
       url("/fonts/Inter-MediumItalic.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 600;
  src: url("/fonts/Inter-SemiBold.woff2") format("woff2"),
       url("/fonts/Inter-SemiBold.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 600;
  src: url("/fonts/Inter-SemiBoldItalic.woff2") format("woff2"),
       url("/fonts/Inter-SemiBoldItalic.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 700;
  src: url("/fonts/Inter-Bold.woff2") format("woff2"),
       url("/fonts/Inter-Bold.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 700;
  src: url("/fonts/Inter-BoldItalic.woff2") format("woff2"),
       url("/fonts/Inter-BoldItalic.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 800;
  src: url("/fonts/Inter-ExtraBold.woff2") format("woff2"),
       url("/fonts/Inter-ExtraBold.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 800;
  src: url("/fonts/Inter-ExtraBoldItalic.woff2") format("woff2"),
       url("/fonts/Inter-ExtraBoldItalic.woff") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 900;
  src: url("/fonts/Inter-Black.woff2") format("woff2"),
       url("/fonts/Inter-Black.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 900;
  src: url("/fonts/Inter-BlackItalic.woff2") format("woff2"),
       url("/fonts/Inter-BlackItalic.woff") format("woff");
}`}`;

    return React.createElement('style', {
      dangerouslySetInnerHTML: { __html: fonts },
    });
  },

  appendIntercomScripts() {
    const script =
      "(function(){var w=window;var ic=w.Intercom;if(typeof ic===\"function\"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/mj324rjy';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()";

    return React.createElement('script', {
      dangerouslySetInnerHTML: { __html: script },
    });
  },
};

module.exports = helpers;

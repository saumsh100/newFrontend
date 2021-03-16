import React from 'react';

const appendFonts = () => {
  const fonts = `
@font-face {
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
}`;

  return React.createElement('style', {
    dangerouslySetInnerHTML: { __html: fonts },
  });
};

export default appendFonts;

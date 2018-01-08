
export default {
  red: '#FF715A',
  blue: '#8FBBD6',
  green: '#2CC4A7',
  yellow: '#FFC55B',
  darkblue: '#206477',
  grey: '#B4B4B4',
  lightgrey: '#DCDCDC',
  dark: '#2E3845',
  primaryBlue: '#206477',
  lightBlue: '#8CBCD6',
  facebookBlue: '#395998',
  lightBlue: '#8CBCD6',
};

export const hexToRgbA = (hex, opacity) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c &255].join(',')}, ${opacity})`;
  }
  throw new Error('Bad Hex');
};

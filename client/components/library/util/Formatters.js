
export const FormatPhoneNumber = (str) => {
  const newStr = str.slice(2,str.length);
  const insertStr = " ";
  return [newStr.slice(0, 3), insertStr, newStr.slice(3,6), insertStr, newStr.slice(6)].join('');
};


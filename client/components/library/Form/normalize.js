
export function normalizePhone(value) {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');
  if (onlyNums.length <= 3) {
    return onlyNums;
  }

  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3)}`;
  }

  return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)} ${onlyNums.slice(6, 10)}`;
}

export function maxDigits(max) {
  return (value) => {
    if (!value) {
      return value;
    }

    console.log('value', value);
    const onlyNums = value.replace(/[^\d]/g, '');
    console.log('onlyNums', onlyNums);
    if (onlyNums.length <= max) {
      return onlyNums;
    } else {
      return onlyNums.slice(0, max);
    }
  };
}

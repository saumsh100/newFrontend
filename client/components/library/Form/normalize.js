
export function normalizePhone(value) {

  const onlyNums = value.replace(/[^(\d|+)]/g, '');

  if (/\+([2-9]|0)/g.test(value)) {
    return '+1' + onlyNums.replace(/\+([2-9]|0)/, '');
  }

  if (value.length < 3) {
    return onlyNums;
  }

  if (onlyNums.length <= 5) {
    return '+1' + onlyNums.replace(/\+1/g, '');
  }

  if (onlyNums.length <= 8) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5)}`;
  }

  if (onlyNums.length === 10 && onlyNums.slice(0, 2) !== '+1') {
    return `+1 ${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)} ${onlyNums.slice(6, 10)}`;
  }

  return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5, 8)} ${onlyNums.slice(8, 12)}`;
}

export function maxDigits(max) {
  return (value) => {
    if (!value) {
      return value;
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= max) {
      return onlyNums;
    } else {
      return onlyNums.slice(0, max);
    }
  };
}

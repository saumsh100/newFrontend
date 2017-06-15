
export function normalizePhone(value) {
  if (!value) {
    return '+1 ' + value;
  }

  const onlyNums = value.replace(/[^(\d|+)]/g, '');
  if (onlyNums === '+') {
    return '+1 ';
  }
  if (onlyNums.length === 1) {
    return '+1 ' + onlyNums;
  }

  if (onlyNums.length <= 5) {
    return onlyNums;
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

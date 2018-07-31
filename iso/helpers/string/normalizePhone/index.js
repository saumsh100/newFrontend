
/**
 * Sanitize and normalize phone numbers,
 * returning a string with the pattern: "+1 XXX XXX XXXX"
 * @param value
 * @returns {string}
 */
const normalizePhone = (value) => {
  const onlyNums = value.replace(/(?![+])[^(\d)]|[(|)]/g, '').replace(/(?!^[+])\D/g, '');

  if (/\+\s?([2-9]|0)/g.test(value)) {
    return normalizePhone(`+1${onlyNums.replace(/\+([2-9]|0)/, '')}`);
  }

  if (value.length <= 3) {
    return onlyNums;
  }

  if (onlyNums.length <= 5 && onlyNums.slice(0, 2) === '+1') {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2)}`;
  }
  if (onlyNums.length <= 5 && onlyNums.slice(0, 2) !== '+1') {
    return `+1 ${onlyNums.slice(0, 3)} ${onlyNums.slice(3)}`;
  }

  if (onlyNums.length <= 8) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5)}`;
  }

  if (onlyNums.length === 10 && onlyNums.slice(0, 2) !== '+1') {
    return `+1 ${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)} ${onlyNums.slice(6, 10)}`;
  }

  return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5, 8)} ${onlyNums.slice(8, 12)}`;
};

export default normalizePhone;

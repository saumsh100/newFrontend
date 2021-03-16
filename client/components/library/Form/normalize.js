
export { normalizePhone } from '../../../util/isomorphic';

export function maxDigits(max) {
  return (value) => {
    if (!value) {
      return value;
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= max) {
      return onlyNums;
    }
    return onlyNums.slice(0, max);
  };
}

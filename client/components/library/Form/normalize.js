
import normalizePhoneISO from '../../../../iso/helpers/string/normalizePhone';

export function normalizePhone(value) {
  return normalizePhoneISO(value);
}

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

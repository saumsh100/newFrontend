
import defaultList from './defaultList';
import { parseDate } from '../../components/library/util/datetime';
import DateRangeDictionary from './dictionary';

/**
 * It gets a word based on a list of dictionaries
 *
 * @param key
 */
const getKeyFromDictionary = (key) => {
  const dictionary = {
    ...DateRangeDictionary,
  };

  return dictionary[key];
};

/**
 * Select a key from a concatenated hashmap.
 *
 * @param list
 */
const dateRangeMapByKey = list => (override = {}) => key => ({ ...list,
  ...override }[key]);

/**
 * Curried function that instantiates the default list of ranges
 *
 * @param date
 */
const dateRangeMapByKeyWithDefault = date => dateRangeMapByKey(defaultList(date))();

/**
 * Creates an object if the provided value is a string.
 *
 * @param value
 */
const buildValueIfString = value =>
  (typeof value === 'string' ? { name: value,
    date: new Date(),
    timezone: '' } : value);

/**
 * From an array of string and objects return an array of date ranges.
 *
 * @param { string[] | {name: string, timezone: string, date: Date}[]} myArgs
 */
export default myArgs =>
  myArgs.reduce((previousValue, currentValue) => {
    const { name, timezone, date } = buildValueIfString(currentValue);
    const key = getKeyFromDictionary(name.toLowerCase());
    const el = dateRangeMapByKeyWithDefault(parseDate(date, timezone))(key);
    return [...previousValue, el];
  }, []);

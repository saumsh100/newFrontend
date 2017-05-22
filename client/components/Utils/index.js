import PropTypes from 'prop-types';
import { isArray, pick, omit as lOmit } from 'lodash';

/**
 * Conver camelCase names to dashed-names
 * @param {string} name
 * @returns {string}
 */
const toDashName = (name) => {
  for (let i = 0; i < name.length; i += 1) {
    if (name[i] >= 'A' && name[i] <= 'Z') {
      return `${name.slice(0, i)}-${name[i].toLowerCase()}${toDashName(name.slice(i + 1))}`;
    }
  }

  return name;
};

/**
 * Make object from array of keys, mapped by fn
 * @param {Array} list
 * @param {Function} fn
 * @returns {object}
 */
const listToObject = (list, fn) =>
  list.reduce((obj, key) => ({ ...obj, [key]: fn(key) }), {});

/**
 * Create object to manipulate with component style properties
 * @example
 *    // Simple boolean key
 *   scheme: [ 'collapsed' ]
 *   props: {}
 *   result: `${style.collapsed}`
 *
 *   // Complex key with enum values
 *   scheme: [ ['alignItems', ['center', 'start']] ]
 *   props: { alignItems: 'center' }
 *   restArgumens: styles.base
 *   result: `${styles['align-items-center']} ${styles.base}`
 *
 * @param {Array} scheme - properties scheme
 * @param {object} styles - CSS Module map
 * @returns {{map: (function(*=, ...[*]=)), omit: (function(*=))}}
 */
export const getClassMapper = (scheme, styles) => {
  const index = scheme.reduce((i, name) => ({
    ...i,
    [isArray(name) ? name[0] : name]: (isArray(name) ?
      listToObject(name[1], () => true) :
      true),
  }), {});

  const indexKeys = Object.keys(index);

  const map = (props, ...rest) => {
    const keys = Object.keys(pick(props, indexKeys));

    const mapKeysWithValues = (key, value) =>
      ((index[key][value] === true) ?
          `${toDashName(key)}-${toDashName(value)}` :
          false
      );

    const mapKeys = (key, value) =>
      ((index[key] === true) ? toDashName(key) : mapKeysWithValues(key, value));

    return keys
      .map(key => mapKeys(key, props[key]))
      .filter(i => i)
      .map(key => styles[key])
      .concat(rest)
      .join(' ');
  };

  const omit = (props, ...other) => lOmit(props, indexKeys.concat(other));

  const types = () => indexKeys.reduce((propTypes, key) => ({
    ...propTypes,
    [key]: (index[key] === true) ? PropTypes.bool : PropTypes.string,
  }), {});

  return { map, omit, types };
};

export const omitTypes = (Class, props) =>
  (Class.propTypes ?
    lOmit(props, Object.keys(Class.propTypes)) :
    props);

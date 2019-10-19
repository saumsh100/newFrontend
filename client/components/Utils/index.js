
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import lOmit from 'lodash/omit';
import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import isFunction from 'lodash/isFunction';
import { capitalize } from '@carecru/isomorphic';

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
  list.reduce(
    (obj, key) => ({
      ...obj,
      [key]: fn(key),
    }),
    {},
  );

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
  const index = scheme.reduce(
    (i, name) => ({
      ...i,
      [isArray(name) ? name[0] : name]: isArray(name) ? listToObject(name[1], () => true) : true,
    }),
    {},
  );

  const indexKeys = Object.keys(index);

  const map = (props, ...rest) => {
    const keys = Object.keys(pick(props, indexKeys));

    const mapKeysWithValues = (key, value) =>
      (index[key][value] === true ? `${toDashName(key)}-${toDashName(value)}` : false);

    const mapKeys = (key, value) =>
      (index[key] === true ? toDashName(key) : mapKeysWithValues(key, value));

    const classes = keys
      .filter(key => props[key]) // can't be falsey
      .map(key => mapKeys(key, props[key]))
      .filter(i => i)
      .map(key => styles[key])
      .concat(rest)
      .filter(i => i && i.length)
      .join(' ');

    return classes;
  };

  const omit = (props, ...other) => lOmit(props, indexKeys.concat(other));

  const types = () =>
    indexKeys.reduce(
      (propTypes, key) => ({
        ...propTypes,
        [key]: index[key] === true ? PropTypes.bool : PropTypes.string,
      }),
      {},
    );

  return {
    map,
    omit,
    types,
  };
};

export const omitTypes = (Class, props) =>
  (Class.propTypes ? lOmit(props, Object.keys(Class.propTypes)) : props);

export const getModel = (state, entityType, id) => {
  const model = state.entities.getIn([entityType, 'models', id]);
  return model ? model.toJS() : model;
};

export const getCollection = (state, entityType, filter = false) => {
  const collection = state.entities.getIn([entityType, 'models']);
  const filteredCollection = isFunction(filter) ? collection.filter(filter) : collection;
  return Object.values(filteredCollection.toJS());
};

export const capitalizeText = string =>
  string
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');

/**
 * Util function to use as findChunks parameter of the highlighter component.
 * Highlight matches only at beginning of words. Word begins after white space or - (hyphen).
 * Ripped of https://codesandbox.io/s/k20x3ox31o
 */
export const findChunksAtBeginningOfWords = ({ searchWords, textToHighlight }) => {
  const chunks = [];
  const textLow = textToHighlight.toLowerCase();
  // Match at the beginning of each new word
  // New word start after whitespace or - (hyphen)
  const sep = /[-\s]+/;

  // Match at the beginning of each new word
  // New word start after whitespace or - (hyphen)
  const singleTextWords = textLow.split(sep);

  // It could be possible that there are multiple spaces between words
  // Hence we store the index (position) of each single word with textToHighlight
  let fromIndex = 0;
  const singleTextWordsWithPos = singleTextWords.map((s) => {
    const indexInWord = textLow.indexOf(s, fromIndex);
    fromIndex = indexInWord + s.length;
    return {
      word: s,
      index: indexInWord,
    };
  });

  // Add chunks for every searchWord
  searchWords.forEach((sw) => {
    const swLow = sw.toLowerCase();
    // Do it for every single text word
    singleTextWordsWithPos.forEach((s) => {
      if (s.word.startsWith(swLow)) {
        const start = s.index;
        const end = s.index + swLow.length;
        chunks.push({
          start,
          end,
        });
      }
    });

    // The complete word including whitespace should also be handled, e.g.
    // searchWord='Angela Mer' should be highlighted in 'Angela Merkel'
    if (textLow.startsWith(swLow)) {
      const start = 0;
      const end = swLow.length;
      chunks.push({
        start,
        end,
      });
    }
  });

  return chunks;
};

/**
 * Checks if the requesting user is the same user of the appoitment
 * @param {*} patientUser
 * @param {*} requestingUser
 */
export const checkIfUsersEqual = (patientUser, requestingUser) => {
  if (requestingUser && patientUser && patientUser.get('id') !== requestingUser.get('id')) {
    return requestingUser;
  }
  return null;
};

/**
 * Builds the props for selected request based on url quer search
 * @param props.routing.location.search query search from url
 * @param props.sortedRequests sorted request from component props
 */
export const selectedRequestBuilder = (props) => {
  const parsedSearch = parse(props.routing.location.search);
  return {
    requestId: parsedSearch.selectedRequest || null,
    selectedRequest: parsedSearch.selectedRequest
      ? props.sortedRequests.filter(req => req.id === parsedSearch.selectedRequest)[0]
      : null,
  };
};

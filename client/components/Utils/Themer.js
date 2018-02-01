
import classNames from 'classnames';
import mergeWith from 'lodash/mergeWith';

/**
 * Extends style-sheet objects
 *
 * @param {object} extendStyle
 * @param {object} baseStyle
 * @returns {object}
 */
export const StyleExtender = (extendStyle = {}, baseStyle) => {
  return mergeWith({}, extendStyle, baseStyle, (a, b) => {
      return classNames(a, b);
  });
};

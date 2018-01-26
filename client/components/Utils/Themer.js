
import classNames from 'classnames';
import pick from 'lodash/pick';

/**
 * Extends style-sheet objects
 * @param {object} extendStyle
 * @param {object} baseStyle
 * @returns {object}
 */
export const StyleExtender = (extendStyle = {}, baseStyle) => {
  const extendedClasses = pick(baseStyle, Object.keys(extendStyle));

  const cloneBaseStyle = Object.assign({}, baseStyle);

  Object.keys(extendedClasses).forEach((key) => {
    const firstStyle = extendStyle[key];
    const secondStyle = baseStyle[key];
    cloneBaseStyle[key] = classNames(firstStyle, secondStyle);
  });

  return cloneBaseStyle;
};

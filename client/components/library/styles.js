/* eslint-disable import/no-mutable-exports */
import oldStyles from './oldStyles.scss';
import newStyles from './newStyles.scss';

let selectedStyle = newStyles;

const getStyles = (isFeatureFlagOn = false) => {
  const styles = isFeatureFlagOn ? newStyles : oldStyles;
  selectedStyle = styles;
  return styles;
};
export { getStyles };
export default selectedStyle;

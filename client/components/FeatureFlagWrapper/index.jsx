
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function FeatureFlagWrapper(props) {
  const { flagged, backupComponent } = props;

  if (flagged) {
    return props.children;
  } else if (backupComponent) {
    return backupComponent;
  }

  return null;
}

FeatureFlagWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  backupComponent: PropTypes.element,
  featureKey: PropTypes.string,
  flags: PropTypes.objectOf(PropTypes.bool),
};

function mapStateToProps({ auth }, { featureKey }) {
  return {
    flagged: auth.get('flags').get(featureKey),
  };
}

export default connect(mapStateToProps, null)(FeatureFlagWrapper);

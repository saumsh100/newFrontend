
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isFeatureEnabledSelector } from '../../reducers/auth';

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
    flagged: isFeatureEnabledSelector(auth.get('flags'), featureKey),
  };
}

export default connect(
  mapStateToProps,
  null,
)(FeatureFlagWrapper);

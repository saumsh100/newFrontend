
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default function withFeatureFlag(BackupComponent, featureKey) {
  return (FlaggedComponent) => {
    class FeatureFlaggedComponent extends Component {
      render() {
        const { flags } = this.props;

        const flagged = flags[featureKey];

        if (flagged) {
          return <FlaggedComponent {...this.props} />;
        } else if (BackupComponent) {
          return <BackupComponent {...this.props} />;
        }

        return null;
      }
    }

    FeatureFlaggedComponent.propTypes = {
      flags: PropTypes.instanceOf(Object),
    };

    function mapStateToProps({ auth }) {
      return {
        flags: auth.get('flags').toJS(),
      };
    }

    return connect(mapStateToProps, null)(FeatureFlaggedComponent);
  };
}

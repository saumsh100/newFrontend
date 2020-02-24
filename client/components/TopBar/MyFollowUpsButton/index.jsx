
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import groupBy from 'lodash/groupBy';
import keys from 'lodash/keys';
import MyFollowUpsButton from './MyFollowUpsButton';
import FetchMyFollowUps from '../../GraphQL/PatientFollowUps/fetchMyFollowUps';
import { jumpToMyFollowUps } from '../../../thunks/patientTable';

/**
 * Wraps the shortcut IconButton in order to fetch the count of patients with follow-ups
 * to display in the badge
 *
 * @param accountId
 * @param assignedUserId
 * @param timezone
 * @param props (used to not clash with functions in upper scope)
 * @returns {*}
 */
function MyFollowUpsButtonContainer({ accountId, assignedUserId, timezone, ...props }) {
  return (
    <FetchMyFollowUps
      variables={{
        assignedUserId,
        accountId,
        timezone,
      }}
    >
      {({ error, data: { patientFollowUps } = {} }) => {
        const count = error
          ? 'x'
          : // Turn it into the number of total patients with these follow-ups outstanding
            patientFollowUps && keys(groupBy(patientFollowUps, 'patientId')).length;

        return <MyFollowUpsButton count={count} onClick={props.jumpToMyFollowUps} />;
      }}
    </FetchMyFollowUps>
  );
}

MyFollowUpsButtonContainer.propTypes = {
  jumpToMyFollowUps: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired,
  assignedUserId: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  accountId: auth.get('accountId'),
  assignedUserId: auth.get('userId'),
  timezone: auth.getIn(['account', 'timezone']),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      jumpToMyFollowUps,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyFollowUpsButtonContainer);

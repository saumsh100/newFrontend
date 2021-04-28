import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import historyShape from '../../components/library/PropTypeShapes/historyShape';
import locationShape from '../../components/library/PropTypeShapes/locationShape';
import userShape from '../../components/library/PropTypeShapes/patientUserShape';
import AccountModel from '../../entities/models/Account';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import MicroFrontEnd from '../micro-front-end';

const { WORKFLOW_HOST: workflowHost } = process.env;

const Workflow = ({ history, location, match, ...rest }) => {
  delete rest.dispatch; // no need for redux at this time
  try {
    history.location.state = rest; // put the required info in to the route state
  } catch (error) {
    history.location.state = undefined;
  }
  const props = { history, location, match };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MicroFrontEnd host={workflowHost} name="Workflow" {...props} />;
};

Workflow.defaultProps = {};

Workflow.propTypes = {
  activeAccount: PropTypes.instanceOf(AccountModel).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  match: PropTypes.shape({}).isRequired,
  user: PropTypes.shape(userShape).isRequired,
  role: PropTypes.string.isRequired,
};

const mapStateToProps = ({ entities, auth, featureFlags }) => {
  const useReminderWorkflowService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service-reminder',
  );
  const useVirtualWaitRoomService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service-wait-room',
  );
  const useReviewService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service-review',
  );
  const useRecallService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service-recall',
  );

  return {
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]).toJS(),
    user: auth.get('user').toJS(),
    role: auth.get('role'),
    useCCPReminder: !useReminderWorkflowService,
    useCCPVirtualWaitRoom: !useVirtualWaitRoomService,
    useCCPRecall: !useRecallService,
    useCCPReview: !useReviewService,
  };
};

export default connect(mapStateToProps)(Workflow);

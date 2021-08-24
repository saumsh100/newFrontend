import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { accountShape } from '../../components/library/PropTypeShapes';
import historyShape from '../../components/library/PropTypeShapes/historyShape';
import locationShape from '../../components/library/PropTypeShapes/locationShape';
import userShape from '../../components/library/PropTypeShapes/patientUserShape';
import AccountModel from '../../entities/models/Account';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import MicroFrontEnd from '../micro-front-end';

const { WORKFLOW_HOST: workflowHost } = process.env;

const Workflow = React.memo(({ history, location, match, ...rest }) => {
  delete rest.dispatch; // no need for redux at this time
  try {
    history.location.state = rest; // put the required info in to the route state
  } catch (error) {
    history.location.state = undefined;
  }

  const props = useMemo(() => ({ history, location, match }), [history, location, match]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MicroFrontEnd host={workflowHost} name="Workflow" {...props} />;
});

Workflow.defaultProps = {};

Workflow.propTypes = {
  activeAccount: PropTypes.instanceOf(AccountModel).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  match: PropTypes.shape({}).isRequired,
  user: PropTypes.shape(userShape).isRequired,
  role: PropTypes.string.isRequired,
  account: PropTypes.shape(accountShape).isRequired,
};

const mapStateToProps = ({ entities, auth, featureFlags }) => {
  const isDev = process.env.NODE_ENV === 'development';
  const useReminderWorkflowService = isDev
    ? true
    : isFeatureEnabledSelector(
        featureFlags.get('flags'),
        'use-templates-from-workflow-service-reminder',
      );
  const useReviewService = isDev
    ? false
    : isFeatureEnabledSelector(
        featureFlags.get('flags'),
        'use-templates-from-workflow-service-review',
      );
  const useRecallService = isDev
    ? false
    : isFeatureEnabledSelector(
        featureFlags.get('flags'),
        'use-templates-from-workflow-service-recall',
      );

  return {
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]).toJS(),
    user: auth.get('user').toJS(),
    role: auth.get('role'),
    account: auth.get('account').toJS(),
    useCCPReminder: !useReminderWorkflowService,
    useCCPVirtualWaitRoom: !useReminderWorkflowService,
    useCCPRecall: !useRecallService,
    useCCPReview: !useReviewService,
  };
};

export default connect(mapStateToProps)(Workflow);

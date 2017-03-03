
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OfficeHoursForm from './OfficeHoursForm';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';

function OfficeHours(props) {
  const { account, weeklySchedule } = props;
  return (
    <div>
      <OfficeHoursForm
        account={account}
        weeklySchedule={weeklySchedule}
        onSubmit={(values) => {
          const newWeeklySchedule = weeklySchedule.merge(values);
          props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule });
        }}
      />
    </div>
  );
}

OfficeHours.propTypes = {
  account: PropTypes.object,
  weeklySchedule: PropTypes.object,
  updateEntityRequest: PropTypes.func,
};

function mapStateToProps({ entities }, { account }) {
  if (!account) return {};
  const weeklySchedule = entities.getIn([
    'weeklySchedules',
    'models',
    account.get('weeklyScheduleId'),
  ]);

  return {
    weeklySchedule,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default enhance(OfficeHours);

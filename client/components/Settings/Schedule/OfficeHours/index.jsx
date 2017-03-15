
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OfficeHoursForm from './OfficeHoursForm';
import BreaksForm from './BreaksForm';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';

function OfficeHours(props) {
  const { weeklySchedule } = props;
  const handleSubmit = (values) => {
    const newWeeklySchedule = weeklySchedule.merge(values);
    props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule });
  };

  return (
    <div>
      <OfficeHoursForm
        weeklySchedule={weeklySchedule}
        onSubmit={handleSubmit}
        formName="officeHours"
      />
      <BreaksForm
        weeklySchedule={weeklySchedule}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

OfficeHours.propTypes = {
  activeAccount: PropTypes.object,
  weeklySchedule: PropTypes.object,
  updateEntityRequest: PropTypes.func,
};

function mapStateToProps({ entities }, { activeAccount }) {
  if (!activeAccount) return {};
  const weeklySchedule = entities.getIn([
    'weeklySchedules',
    'models',
    activeAccount.get('weeklyScheduleId'),
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

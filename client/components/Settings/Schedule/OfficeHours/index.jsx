
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OfficeHoursForm from './OfficeHoursForm';
import BreaksForm from './BreaksForm';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Header } from '../../../library';
import styles from './styles.scss';

function OfficeHours(props) {
  const { weeklySchedule } = props;
  const handleSubmit = (values) => {
    const newWeeklySchedule = weeklySchedule.merge(values);
    props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule });
  };

  return (
    <div>
      <Header title="Weekly Schedule" className={styles.header} />
      <OfficeHoursForm
        weeklySchedule={weeklySchedule}
        onSubmit={handleSubmit}
        formName="officeHours"
      />
      <Header title="Breaks" className={styles.header} />
      <BreaksForm
        weeklySchedule={weeklySchedule}
        onSubmit={handleSubmit}
        formName="officeHours"
        breaksName="clinicBreaks"
      />
    </div>
  );
}

OfficeHours.propTypes = {
  activeAccount: PropTypes.object,
  weeklySchedule: PropTypes.object,
  updateEntityRequest: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  if (!activeAccount) {
    return {};
  }

  const weeklySchedule = entities.getIn([
    'weeklySchedules',
    'models',
    activeAccount.get('weeklyScheduleId'),
  ]);

  return {
    weeklySchedule,
    activeAccount,
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

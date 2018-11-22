
import dueWithin from './dueWithin/index';
import missedCancelled from './missedCancelled/index';
import missedPreAppointed from './missedPreAppointed/index';
import unConfirmedPatients from './unConfirmedPatients/index';
import lateAppointments from './lateAppointments/index';

function allPatients() {
  return {};
}

export default {
  allPatients,
  dueWithin,
  lateAppointments,
  missedCancelled,
  missedPreAppointed,
  unConfirmedPatients,
};

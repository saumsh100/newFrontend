
import createModel from '../createModel';

const WaitSpotSchema = {
  id: null,
  patientId: null,
  patientUserId: null,
  accountId: null,
  preferences: null,
  daysOfTheWeek: null,
  unavailableDays: null,
  unavailableDates: [],
  availableDates: [],
  availableTimes: [],
  endDate: null,
  createdAt: null,
};

export default class WaitSpot extends createModel(WaitSpotSchema) {
  getUrlRoot() {
    return `/api/waitSpots/${this.get('id')}`;
  }
}

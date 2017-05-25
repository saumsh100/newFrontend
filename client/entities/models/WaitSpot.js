
import createModel from '../createModel';

const WaitSpotSchema = {
  id: null,
  patientId: null,
  accountId: null,
  preferences: null,
  unavailableDays: null,
};

export default class WaitSpot extends createModel(WaitSpotSchema) {
  getUrlRoot() {
    return `/api/waitSpots/${this.get('id')}`;
  }
}

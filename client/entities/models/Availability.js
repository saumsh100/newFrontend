
import createModel from '../createModel';

const AvailabilitySchema = {
  id: null,
  date: null,
  availabilities: null,
};

export default class Availability extends createModel(AvailabilitySchema) {

}

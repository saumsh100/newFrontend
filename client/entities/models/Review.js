
import createModel from '../createModel';

const ReviewSchema = {
  id: null,
  stars: null,
  description: null,
  patientUserId: null,
  practitionerId: null,
};

export default class Review extends createModel(ReviewSchema) {

}

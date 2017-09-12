
import createModel from '../createModel';

const ReviewSchema = {
  id: null,
  stars: 4,
  description: null,
  patientUserId: null,
  practitionerId: null,
};

export default class Review extends createModel(ReviewSchema) {

}

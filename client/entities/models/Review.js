
import createModel from '../createModel';

const ReviewSchema = {
  id: null,
  stars: null,
  description: null,
  patientUserId: null,
};

export default class Review extends createModel(ReviewSchema) {

}

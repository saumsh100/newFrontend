
import createModel from '../createModel';

const ReviewSchema = {
  id: null,
  stars: 4,
  description: null,
  patientUserId: null,
  practitionerId: '0f1cd6fe-5956-4ef6-99db-2bb85ca3fbf3',
};

export default class Review extends createModel(ReviewSchema) {

}

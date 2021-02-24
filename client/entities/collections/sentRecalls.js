
import createCollection from '../createCollection';
import SentRecall from '../models/SentRecall';

export default class sentRecalls extends createCollection(SentRecall) {
  getUrlRoot() {
    return '/api/sentRecalls';
  }
}

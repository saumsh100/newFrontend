
import reducer, {
  CREATE_REQUEST,
  RECEIVE_REQUEST,
  ERROR_REQUEST,
} from '../../../client/reducers/apiRequests';

describe('Reducer - apiRequests', () => {
  describe(CREATE_REQUEST, () => {
    it('should be a function', () => {
      expect(typeof reducer).toBe('function');
    });
  });

  describe(RECEIVE_REQUEST, () => {
    it('should be a function', () => {
      expect(typeof reducer).toBe('function');
    });
  });

  describe(ERROR_REQUEST, () => {
    it('should be a function', () => {
      expect(typeof reducer).toBe('function');
    });
  });
});

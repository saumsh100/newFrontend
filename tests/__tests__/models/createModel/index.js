
import thinky from '../../../../server/config/thinky';
import createModel from '../../../../server/models/createModel';

describe('#createModel', () => {
  it('should be a function', () => {
    expect(typeof createModel).toBe('function');
  });

  // TODO: test creation of Models (create 'Thing' model) (ensure a table is created in DB?)
  // TODO: test validators...
  // TODO: test requireds, defaults, etc.

  describe('Unique Fields w/ Auxilliary Tables', () => {
    it('should rep the API', () => {
      const Model = createModel('Thing', {

      }, {
        aux: {
          name: {
            value: 'id',
          },
        },
      });
    });

  });

});



import createModel from '../../../../server/models/createModel';
import dropTables from './dropTables';

const thinky = require('../../../../server/config/thinky');
const type = thinky.type;

const dropTestModelTables = dropTables.dropTestModelTables;
const listTables = dropTables.listTables;
const deleteAllFrom = dropTables.deleteAllFrom;

const TEST_MODEL = 'TestModel';
const CARECRU = 'carecru';
const NOT_CARECRU = 'not_carecru';

function delay(seconds, calculation) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const val = calculation();
      if (val) return resolve(val);
      reject();
    }, seconds);
  });
}

describe('#createModel', () => {

  // afterEach((done) => {
  //   console.log('running after each');
  //   dropTestModelTables(TEST_MODEL)
  //     .then(() => {
  //       console.log('Dropped FakeTable');
  //       done();
  //     })
  //     .catch(error => console.log('kfdjghdkfjghdkjg', error));
  //   // return deleteAllFrom(TEST_MODEL);
  // });

  it('test1', () => {
    expect(2 + 2).toBe(4);
  });

  describe('math test 2', () => {
    it('test2', () => {
      expect(3 + 3).toBe(6);
    });
  });

  describe('math test 2 async', () => {
    it('async test', (done) => {
      delay(2000, () => {
        return 2 * 3;
      }).then((num) => {
        expect(num).toBe(6);
        console.log('test ran');
        done();
      });
    });

  });

  // it('should be a function', () => {
  //   expect(typeof createModel).toBe('function');
  // });

  // TODO: test creation of Models (create 'Thing' model) (ensure a table is created in DB?)
  // TODO: test validators...
  // TODO: test requireds, defaults, etc.

  describe('Model.docOn(\'saving\')', () => {
    // afterEach((done) => {
    //   dropTestModelTables(TEST_MODEL).then(() => done());
    // });

    it('should call docOn saving hook with Model.save - synchronous', () => {
      const TestModel = createModel(TEST_MODEL+0, {
        name: type.string(),
      });

      const fn = jest.fn();
      // setup validate function to replace the phone number
      TestModel.docOn('saving', (doc) => {
        fn();
        console.log('.>..... saving');
      });

      const testModelInstance = { homePhoneNumber: '7782422626' };

      return TestModel.save(testModelInstance)
        .then((persistedModel) => {
          expect(fn.mock.calls.length).toBe(1);
        });
    });
  });

  describe('Model.pre(\'save\')', () => {
    it('it should be called before Model.save - sync', () => {
      const TestModel = createModel(TEST_MODEL+1, {
        name: type.string(),
      });

      // SYNC pre save call
      const fn = jest.fn();
      TestModel.pre('save', function(next) {
        fn();
        this.name = NOT_CARECRU;
        next();
      });

      const testModelInstance = { name: CARECRU };

      // Model.save
      return TestModel.save(testModelInstance)
        .then((persistedModel) => {
          expect(fn.mock.calls.length).toBe(1);
          expect(persistedModel.name).toBe(NOT_CARECRU);
        });
    });

    it('it should be called before Model.save - async', () => {
      const TestModel = createModel(TEST_MODEL+2, {
        name: type.string(),
      });

      // mock ASYNC function to return a different name value
      const mockValidate = jest.fn((cb) => {
        delay(2000, () => {
          return NOT_CARECRU;
        }).then((result) => {
          cb(result);
        });
      });

      // ASYNC pre save call
      TestModel.pre('save', function(next) {
        mockValidate((newName) => {
          this.name = newName;
          console.log('async pre save hook finishing');
          next();
        });
      });

      const testModelInstance = { name: CARECRU };

      // Model.save
      return TestModel.save(testModelInstance)
        .then((persistedModel) => {
          expect(mockValidate.mock.calls.length).toBe(1);
          expect(persistedModel.name).toBe(NOT_CARECRU);
        });
    });

    // it should be called before creating document then .save()
    it('it should be called before creating document.save()', () => {
      const TestModel = createModel(TEST_MODEL+3, {
        name: type.string(),
      });

      // mock SYNC function
      const fn = jest.fn();

      // SYNC mock pre save call
      TestModel.pre('save', function(next) {
        fn();
        this.name = NOT_CARECRU;
        next();
      });

      const newDoc = new TestModel({ name: CARECRU });
      newDoc.save()
        .then((newPersistedDoc) => {
          expect(fn.mock.calls.length).toBe(1);
          expect(newPersistedDoc.name).toBe(NOT_CARECRU);
        });
    });

    // it should be called before fetching document, merging, then .save()
  });


  // TODO this is next
  /* describe('validateFn', () => {
    // this should work for us but gets called all the time
  }); */












  // TODO old, broken
  // test('call docOn saving with Model.merge', (done) => {
  //   const TestModel = createModel(TEST_MODEL+2, {
  //     homePhoneNumber: type.string(),
  //   }, {
  //     aux: {
  //       name: {
  //         value: 'id',
  //       },
  //     },
  //   });
  //
  //   // setup validate function to replace the phone number
  //   TestModel.docOn('saving', (doc) => {
  //     doc.homePhoneNumber = '111';
  //   });
  //
  //   const testModelInstance = Object.assign({}, { homePhoneNumber: '7782422626' });
  //   let persistedTestModel = {};
  //
  //   const prom1 = TestModel.save(testModelInstance)
  //     .then((testModel) => {
  //       console.log('executing prom1');
  //       persistedTestModel = testModel;
  //       expect(testModel.id).not.toBeNull();
  //       expect(testModel.homePhoneNumber).toBe('111');
  //     });
  //
  //   // need to make sure these are are in order to test correctly
  //   const modifiedPersistedTestModel = Object.assign({}, persistedTestModel, { homePhoneNumber: '6045700922' });
  //   const prom2 = persistedTestModel.merge(modifiedPersistedTestModel).save()
  //     .then((updatedTestModel) => {
  //       console.log('executing prom2');
  //       expect(testModel.id).not.toBeNull();
  //       expect(testModel.homePhoneNumber).toBe('6045700922');
  //     });
  //
  //   // Promise.all([prom1, prom2]).then(() => {
  //   //   console.log('done');
  //   //   done();
  //   // });
  // });
});

// function deleteFakeModelsForTests() {
//   // const TM = createModel('TestModel', {
//   //   homePhoneNumber: thinky.type.string(),
//   // });
//   // TM.delete().run();
//   // // thinky.table('TestModel').delete().run();
//
// }

// still needs a model
// function del() {
//   const query = new Query('TestModel', thinky)
//   // ...
// }

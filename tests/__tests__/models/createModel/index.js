
import thinky from '../../../../server/config/thinky';
import createModel from '../../../../server/models/createModel';
import dropTables from './dropTables';

const dropTestModelTables = dropTables.dropTestModelTables;
const listTables = dropTables.listTables;

const TEST_MODEL = 'TestModel';

describe('#createModel', () => {

  afterEach((done) => {
    console.log('running after each');
    dropTestModelTables(TEST_MODEL)
      .then(() => {
        console.log('Dropped FakeTable');
        done();
      })
      .catch(error => console.log('kfdjghdkfjghdkjg', error));
  });

  // it('should be a function', () => {
  //   expect(typeof createModel).toBe('function');
  // });

  // TODO: test creation of Models (create 'Thing' model) (ensure a table is created in DB?)
  // TODO: test validators...
  // TODO: test requireds, defaults, etc.

  it('shouldRepTheApi', () => {
    console.log('shouldRepTheApi');
    const Model = createModel(TEST_MODEL, {
      homePhoneNumber: thinky.type.string(),
    }, {
      aux: {
        name: {
          value: 'id',
        },
      },
    });
  });

  it('call docOn saving with Model.save', (done) => {
    console.log('running call docOn saving with Model.save');
    const TestModel = createModel(TEST_MODEL, {
      homePhoneNumber: thinky.type.string(),
    }, {
      aux: {
        name: {
          value: 'id',
        },
      },
    });

    // setup validate function to replace the phone number
    TestModel.docOn('saving', (doc) => {
      doc.homePhoneNumber = '111';
    });

    const testModelInstance = Object.assign({}, { homePhoneNumber: '7782422626' });
    TestModel.save(testModelInstance)
      .then((persistedModel) => {
        expect(persistedModel.id).not.toBeNull();
        expect(persistedModel.homePhoneNumber).toBe('111');
      });
    done();
  });

  test('call docOn saving with Model.merge', (done) => {
    const TestModel = createModel(TEST_MODEL+2, {
      homePhoneNumber: thinky.type.string(),
    }, {
      aux: {
        name: {
          value: 'id',
        },
      },
    });

    // setup validate function to replace the phone number
    TestModel.docOn('saving', (doc) => {
      doc.homePhoneNumber = '111';
    });

    const testModelInstance = Object.assign({}, { homePhoneNumber: '7782422626' });
    let persistedTestModel = {};

    const prom1 = TestModel.save(testModelInstance)
      .then((testModel) => {
        console.log('executing prom1');
        persistedTestModel = testModel;
        expect(testModel.id).not.toBeNull();
        expect(testModel.homePhoneNumber).toBe('111');
      });

    // need to make sure these are are in order to test correctly
    const modifiedPersistedTestModel = Object.assign({}, persistedTestModel, { homePhoneNumber: '6045700922' });
    const prom2 = persistedTestModel.merge(modifiedPersistedTestModel).save()
      .then((updatedTestModel) => {
        console.log('executing prom2');
        expect(testModel.id).not.toBeNull();
        expect(testModel.homePhoneNumber).toBe('6045700922');
      });

    Promise.all([prom1, prom2]);

  });
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

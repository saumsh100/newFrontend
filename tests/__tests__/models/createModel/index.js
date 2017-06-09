
import { v4 as uuid } from 'uuid';
import { omit as omit } from 'lodash';

const createModel = require('../../../../server/models/createModel');
const thinky = require('../../../../server/config/thinky');


const type = thinky.type;

const TEST_MODEL = 'TestModel';
const CARECRU = 'carecru';
const NOT_CARECRU = 'not_carecru';

const testAccountId = uuid();

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;

function delay(milliseconds, calculation) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const val = calculation();
      if (val) return resolve(val);
      reject();
    }, milliseconds);
  });
}

describe('#async mocks', () => {

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
        // console.log('math test 2 async async test ran');
        done();
      });
    });

  });
});
  // it('should be a function', () => {
  //   expect(typeof createModel).toBe('function');
  // });

  // TODO: test creation of Models (create 'Thing' model) (ensure a table is created in DB?)
  // TODO: test validators...
  // TODO: test requireds, defaults, etc.

describe('#createModel', () => {

  afterEach(() => {
    return thinky.r.tableDrop(TEST_MODEL)
      .then(() => {
        delete thinky.models[TEST_MODEL];
      });
  });

  describe('Model.docOn(\'saving\')', () => {

    test('should call docOn saving hook with Model.save - synchronous', () => {
      const TestModel = createModel(TEST_MODEL, {
        nameField: type.string(),
      });

      const fn = jest.fn();
      // setup validate function to replace the phone number
      TestModel.docOn('saving', (doc) => {
        fn();
        console.log('.>..... saving');
      });

      const testModelInstance = {homePhoneNumber: '7782422626'};

      return TestModel.save(testModelInstance)
        .then((persistedModel) => {
          expect(fn.mock.calls.length).toBe(1);
        });
    });
  });

  /**
   * will the hook be called on Model.save? expect yes
   */
  describe('Model.pre(\'save\')', () => {

    test('it should be called before Model.save - sync', () => {
      const TestModel = createModel(TEST_MODEL, {
        name: type.string(),
      });

      // SYNC pre save call
      const fn = jest.fn();
      TestModel.pre('save', function (next) {
        fn();
        this.name = NOT_CARECRU;
        next();
      });

      const testModelInstance = {name: CARECRU};

      // Model.save
      return TestModel.save(testModelInstance)
        .then((persistedModel) => {
          expect(fn.mock.calls.length).toBe(1);
          expect(persistedModel.name).toBe(NOT_CARECRU);
        });
      // .catch((error) => {
      //   console.log('...... error', error);
      // });
    });

    /**
     * will the hook be called with async function on Model.save? expect yes
     */
    test('it should be called before Model.save - async', () => {
      const TestModel = createModel(TEST_MODEL, {
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
      TestModel.pre('save', function (next) {
        mockValidate((newName) => {
          this.name = newName;
          console.log('async pre save hook finishing');
          next();
        });
      });

      const testModelInstance = {name: CARECRU};

      // Model.save
      return TestModel.save(testModelInstance)
        .then((persistedModel) => {
          expect(mockValidate.mock.calls.length).toBe(1);
          expect(persistedModel.name).toBe(NOT_CARECRU);
        });
    });

    /**
     * will the hook be called on these:
     * - save model; expect yes
     * - do document.save instead of model.save; expect yes
     */
    // it should be called before creating document then .save()
    test('it should be called before creating document.save()', () => {
      const TestModel = createModel(TEST_MODEL, {
        name: type.string(),
      });

      // mock SYNC function
      const fn = jest.fn();

      // SYNC mock pre save call
      TestModel.pre('save', function (next) {
        fn();
        this.name = NOT_CARECRU;
        next();
      });

      const newDoc = new TestModel({name: CARECRU});
      return newDoc.save()
        .then((newPersistedDoc) => {
          expect(fn.mock.calls.length).toBe(1);
          expect(newPersistedDoc.name).toBe(NOT_CARECRU);
        });
    });

    // it should be called before fetching document, merging, then .save()
    /**
     * will the hook be called on these:
     * save on model: should be called
     * do a get: should not be called
     * do a merge and save: should be called
     */
    it('it should be called before fetching document, merging, then .save()', () => {
      const TestModel = createModel(TEST_MODEL, {
        name: type.string(),
      });

      const fn = jest.fn();
      TestModel.pre('save', function (next) {
        this.name = NOT_CARECRU;
        fn();
        next();
      });

      return TestModel.save({name: CARECRU})
        .then((newPersistedDoc) => {
          expect(newPersistedDoc.name).toBe(NOT_CARECRU);
          expect(fn.mock.calls.length).toBe(1);

          // Not expect pre save to run here
          TestModel.get(newPersistedDoc.id)
            .then(() => {
              expect(fn.mock.calls.length).toBe(1);

              // Expect to pre save to run here
              newPersistedDoc.merge({name: 'newName'}).save()
                .then((result) => {
                  expect(fn.mock.calls.length).toBe(2);
                  expect(result.name).toBe(NOT_CARECRU);
                });
            });
        });
    });
  });
});

  /* describe('validateFn', () => {
   // this should work for us but gets called all the time
   }); */

describe('create aux table testing', () => {

  afterEach(() => {
    return thinky.r.tableDrop(TEST_MODEL)
      .then(() => {
        delete thinky.models[TEST_MODEL];
      });
  });

  afterEach(() => {
    return thinky.r.tableDrop(TEST_MODEL+'_mobilePhoneNumber')
      .then(() => {
        delete thinky.models[TEST_MODEL+'_mobilePhoneNumber'];
      });
  });

  test('should create model table and aux table; no deps', () => {
    const TestModel = createModel(TEST_MODEL, {
      name: type.string(),
    }, {
      aux: {
        mobilePhoneNumber: {
          value: 'id',
        },
      },
    });
    const auxTableName = TEST_MODEL + '_mobilePhoneNumber';
    const AuxTableModel = TestModel.auxModels['mobilePhoneNumber'];

    expect(AuxTableModel).not.toBeNull();

    return AuxTableModel.save({ id: 'some unique id', mobilePhoneNumber: '7782422626' })
      .then((result) => {
        expect(result.mobilePhoneNumber).toBe('7782422626');
      });
  });

  test('should create model table and aux table - with single dependency', () => {
    const TestModel = createModel(TEST_MODEL, {
      fname: type.string(),
      mobilePhoneNumber: type.string(),
    }, {
      aux: {
        mobilePhoneNumber: {
          value: 'id',                 // unique value we are trying to provide
          dependencies: ['accountId'], // what we use to check for uniqueness
        },
      },
    });

    const AuxTableModel = TestModel.auxModels['mobilePhoneNumber'];
    expect(AuxTableModel.getTableName()).toBe(TEST_MODEL + '_mobilePhoneNumber');
    expect(AuxTableModel).not.toBeNull();

    //                              value                               dependencies
    //                                                              fieldName.[deps]join(DELIM)
    return AuxTableModel.save({ id: 'some unique id', 'mobilePhoneNumber.accountId': ['7782422626', 'accountId1'] })
      .then((result) => {
        expect(result['mobilePhoneNumber.accountId'])
          .toEqual(expect.arrayContaining(['7782422626', 'accountId1']));
      });
  });

  test('should create model table and aux table - with two dependencies', () => {
    const TestModel = createModel(TEST_MODEL, {
      fname: type.string(),
      mobilePhoneNumber: type.string(),
    }, {
      aux: {
        mobilePhoneNumber: {
          value: 'id',
          dependencies: ['accountId', 'familyId'],
        },
      },
    });

    const AuxTableModel = TestModel.auxModels['mobilePhoneNumber'];
    expect(AuxTableModel.getTableName()).toBe(TEST_MODEL + '_mobilePhoneNumber');
    expect(AuxTableModel).not.toBeNull();

    //                              value                               dependencies
    //                                                              fieldName.[deps]join(DELIM)
    return AuxTableModel.save({
      id: 'some unique id',
      'mobilePhoneNumber.accountId.familyId': ['7782422626', 'accountId1', 'familyId1'],
    })
      .then((result) => {
        expect(result['mobilePhoneNumber.accountId.familyId'])
          .toEqual(expect.arrayContaining(['7782422626', 'accountId1', 'familyId1']));
      });
  });
});

describe('test aux tables use cases - simple inserts', () => {

  afterEach(() => {
    return thinky.r.tableDrop(TEST_MODEL)
      .then(() => {
        delete thinky.models[TEST_MODEL];
      });
  });

  afterEach(() => {
    return thinky.r.tableDrop(TEST_MODEL+'_mobilePhoneNumber')
      .then(() => {
        delete thinky.models[TEST_MODEL+'_mobilePhoneNumber'];
      });
  });

  test('create TestModel, insert the same value twice into it', () => {
    const TestModel = createModel(TEST_MODEL, {
      fname: type.string(),
      mobilePhoneNumber: type.string(),
    }, {
      aux: {
        mobilePhoneNumber: {
          value: 'id',
        },
      },
    });

    return TestModel.save({ mobilePhoneNumber: '7782422626' })
      .then((savedDoc1) => {
        expect(savedDoc1.mobilePhoneNumber).toBe('7782422626');

        return TestModel.save({ mobilePhoneNumber: '7782422626' });
      })
      .then((result) => {
        throw new Error('Test is incorrect. Should not be able to write in this test.');
      })
      .catch((error) => {
        expect(error.message).toBe('Unique Field Validation Error');
      });
  });

  test('create TestModel, insert different values into it - should pass', () => {
    const TestModel = createModel(TEST_MODEL, {
      fname: type.string(),
      mobilePhoneNumber: type.string(),
    }, {
      aux: {
        mobilePhoneNumber: {
          value: 'id',
        },
      },
    });

    return TestModel.save({ mobilePhoneNumber: '7782422626' })
      .then((savedDoc1) => {
        expect(savedDoc1.mobilePhoneNumber).toBe('7782422626');

        return TestModel.save({ mobilePhoneNumber: '6041112233' });
      })
      .then((result) => {
        expect(result.mobilePhoneNumber).toBe('6041112233');
      });
  });
});

describe
('test aux tables use cases - 1 unique fields, 3 deps', () => {

  afterEach(() => {
    return thinky.r.tableDrop(TEST_MODEL)
      .then(() => {
        delete thinky.models[TEST_MODEL];
      });
  });

  afterEach(() => {
    return thinky.r.tableDrop(TEST_MODEL+'_mobilePhoneNumber')
      .then(() => {
        delete thinky.models[TEST_MODEL+'_mobilePhoneNumber'];
      });
  });

  /*
   {
   "id":  "f9bfc706-b99d-4f3b-8664-85fa42f3adff" ,
     "mobilePhoneNumber.accountId.email.homePhoneNumber": [
     "7782422626" ,
     "uniqueAccId" ,
     sergey@carecru.com, »
     "6045700922"
     ]
   }
   */
  test('create TestModel, insert two same mobilePhoneNumber values into it', () => {
    const TestModel = createModel(TEST_MODEL, {
      fname: type.string(),
      mobilePhoneNumber: type.string(),
      homePhoneNumber: type.string(),
      email: type.string(),
      accountId: type.string(),
    }, {
      aux: {
        mobilePhoneNumber: {
          value: 'id',
          dependencies: ['accountId', 'email', 'homePhoneNumber'],
        },
      },
    });

    const primaryKeyArray = ['mobilePhoneNumber', 'accountId', 'email', 'homePhoneNumber'];
    const pkField = primaryKeyArray.join('.');

    const TestModelAux = TestModel.auxModels.mobilePhoneNumber;

    return TestModel
      .save({
        mobilePhoneNumber: '7782422626',
        homePhoneNumber: '6045700922',
        email: 'sergey@carecru.com',
        accountId: 'uniqueAccId',
      })
      .then((savedDoc1) => {
        // console.log('>>>>', savedDoc1);
        expect(savedDoc1.mobilePhoneNumber).toBe('7782422626');
        expect(savedDoc1.homePhoneNumber).toBe('6045700922');
        expect(savedDoc1.email).toBe('sergey@carecru.com');
        expect(savedDoc1.accountId).toBe('uniqueAccId');

        // order of elements in the array is important here
        const primaryKeyArray = ['7782422626', 'uniqueAccId', 'sergey@carecru.com', '6045700922'];

        return TestModelAux
          .get(primaryKeyArray)
          .then((result) => {
            // console.log('TestModelAux result ', result);
            // console.log('result id', result.id);
            // console.log('pkFieldName', pkField);
            expect(result.id).toBe(savedDoc1.id);
            expect(Array.isArray(result[pkField])).toBe(true);

            const sameDocAgain = omit(savedDoc1, ['id', 'createdAt']);
            // console.log('writing same doc again', sameDocAgain);
            return TestModel.save(sameDocAgain);
          });
      })
      .then((result) => {
        throw new Error('Test is incorrect. Should not be able to write in this test.');
      })
      .catch((error) => {
        expect(error.message).toBe('Unique Field Validation Error');
      });
  });

  test('create TestModel, insert two different mobilePhoneNumber values into it', () => {
    const TestModel = createModel(TEST_MODEL, {
      fname: type.string(),
      mobilePhoneNumber: type.string(),
      homePhoneNumber: type.string(),
      email: type.string(),
      accountId: type.string(),
    }, {
      aux: {
        mobilePhoneNumber: {
          value: 'id',
          dependencies: ['accountId', 'email', 'homePhoneNumber'],
        },
      },
    });

    const primaryKeyArray = ['mobilePhoneNumber', 'accountId', 'email', 'homePhoneNumber'];
    const pkField = primaryKeyArray.join('.');

    const TestModelAux = TestModel.auxModels.mobilePhoneNumber;

    return TestModel
      .save({
        mobilePhoneNumber: '7782422626',
        homePhoneNumber: '6045700922',
        email: 'sergey@carecru.com',
        accountId: 'uniqueAccId',
      })
      .then((savedDoc1) => {
        // console.log('>>>>', savedDoc1);
        expect(savedDoc1.mobilePhoneNumber).toBe('7782422626');
        expect(savedDoc1.homePhoneNumber).toBe('6045700922');
        expect(savedDoc1.email).toBe('sergey@carecru.com');
        expect(savedDoc1.accountId).toBe('uniqueAccId');

        // order of elements in the array is important here
        const primaryKeyArray = ['7782422626', 'uniqueAccId', 'sergey@carecru.com', '6045700922'];

        return TestModelAux
          .get(primaryKeyArray)
          .then((result) => {
            expect(result.id).toBe(savedDoc1.id);
            expect(Array.isArray(result[pkField])).toBe(true);

            const newDoc = omit(savedDoc1, ['id', 'createdAt']);
            Object.assign(newDoc, { mobilePhoneNumber: '1112223344' });
            console.log('writing new doc', newDoc);
            return TestModel.save(newDoc);
          });
      })
      .then((result) => {
        expect(result.mobilePhoneNumber).toBe('1112223344');
      });
  });
});


// describe.only('write, create, update aux tables on model create', () => {

  // TODO: Unique Fields

  // TODO: it should properly write into the auxilliary table
  // TODO: it should properly update the auxilliary table

  // TODO: it should FAIL if you are trying to save 2 docs with the same field w/ Model.save([ doc1, doc2 ])
  // TODO: if should FAIL for consecutive saves doc1.save().then.doc2.save()


  // TODO this is next

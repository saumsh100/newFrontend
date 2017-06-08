
const createModel = require('../../../../server/models/createModel');
const thinky = require('../../../../server/config/thinky');

const type = thinky.type;

const TEST_MODEL = 'TestModel';
const CARECRU = 'carecru';
const NOT_CARECRU = 'not_carecru';

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

// describe.only('write, create, update aux tables on model create', () => {

  // TODO: Unique Fields

  // TODO: it should properly write into the auxilliary table
  // TODO: it should properly update the auxilliary table

  // TODO: it should FAIL if you are trying to save 2 docs with the same field w/ Model.save([ doc1, doc2 ])
  // TODO: if should FAIL for consecutive saves doc1.save().then.doc2.save()


  // TODO this is next

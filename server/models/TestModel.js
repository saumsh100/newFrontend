
const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const TestModel = createModel('TestModel', {
  name: type.string(),
  homePhoneNumber: type.string(),
});

TestModel.docOn('saving', validateTestModel);

function validateTestModel(doc) {
  console.log('TestMode.validateTestModel: validating doc', doc);
}

module.exports = TestModel;

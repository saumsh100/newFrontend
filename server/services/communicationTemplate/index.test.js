
import { AccountTemplate, Template } from 'CareCruModels';
import { seedTestUsers, accountId } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';
import { omitProperties } from '../../../tests/util/selectors';
import { findAccountTemplate, validateParameters, composeMessage, getMessageFromTemplates } from './';

const templateId1 = '0486edfc-7e4f-464f-8fe7-a38bb6a37a52';
const templateId2 = '1486edfc-7e4f-464f-8fe7-a38bb6a37a52';
const templateId3 = '1486edfc-7e4f-464f-8fe7-a38bb6a37a53';
const accountTemplateId1 = '2486edfc-7e4f-464f-8fe7-a38bb6a37a52';
const accountTemplateId2 = '3486edfc-7e4f-464f-8fe7-a38bb6a37a52';
const accountTemplateId3 = '4486edfc-7e4f-464f-8fe7-a38bb6a37a52';
const accountTemplateId4 = '5486edfc-7e4f-464f-8fe7-a38bb6a37a52';

describe('services.communicationTemplate', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await Template.bulkCreate([
      {
        id: templateId1,
        templateName: 'test-template',
        values: { name: true },
      },
      {
        id: templateId2,
        templateName: 'test-template-1',
        values: {
          age: true,
          name: true,
        },
      },
      {
        id: templateId3,
        templateName: 'test-template-2',
        values: {
          clinic: true,
          'patient.firstName': true,
          'patient.lastName': true,
          'patient.age': true,
        },
      },
    ]);
    await AccountTemplate.bulkCreate([
      {
        id: accountTemplateId1,
        templateId: templateId1,
        value: 'Great One ${name}',
      },
      {
        id: accountTemplateId2,
        templateId: templateId2,
        value: 'default One ${name}, ${age}.',
      },
      {
        id: accountTemplateId4,
        templateId: templateId3,
        value: 'Welcome ${patient.firstName} ${patient.lastName}, from ${clinic}.',
      },
      {
        id: accountTemplateId3,
        accountId,
        templateId: templateId2,
        value: 'Personalized template for ${name}, ${age}.',
      },
    ]);
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('DB related tests', () => {
    it('finds the accountTemplate for a given accountId and templateName', async () => {
      const accountTemplate = await findAccountTemplate(accountId, 'test-template-1');
      const rawTemplate = accountTemplate.get({ plain: true });
      const omitedTemplate = omitProperties(rawTemplate, ['template']);
      const omitedRawTemplate = omitProperties(rawTemplate.template);
      expect(omitedTemplate).toMatchSnapshot();
      expect(omitedRawTemplate).toMatchSnapshot();
    });

    it('returns the default accountTemplate if account specific template is not found', async () => {
      const accountTemplate = await findAccountTemplate(accountId, 'test-template');
      const rawTemplate = accountTemplate.get({ plain: true });
      const omitedTemplate = omitProperties(rawTemplate, ['template']);
      const omitedRawTemplate = omitProperties(rawTemplate.template);
      expect(omitedTemplate).toMatchSnapshot();
      expect(omitedRawTemplate).toMatchSnapshot();
    });
  });

  describe('template compiler', () => {
    it('validates template params', () => {
      const templateParams = {
        name: true,
        age: true,
      };
      const givenParams = {
        name: 'Donna',
        age: 22,
        address: 'My city',
      };

      expect(validateParameters(templateParams, givenParams)).toMatchSnapshot();
    });

    it('validates template params for object childs', () => {
      const templateParams = {
        name: true,
        age: true,
        'patient.firstName': true,
      };
      const givenParams = {
        name: 'Donna',
        age: 22,
        address: 'My city',
        patient: { firstName: 'Mike' },
      };

      expect(validateParameters(templateParams, givenParams)).toMatchSnapshot();
    });

    it('assign parameters', () => {
      const data = {
        name: 'Donna',
        age: 22,
      };

      expect(composeMessage('cool string, ${age}, ${name}.', data)).toBe('cool string, 22, Donna.');
    });
  });

  it('compiles the message with a default template', async () => {
    const message = await getMessageFromTemplates(accountId, 'test-template', {
      name: 'Donna',
      age: 22,
    });
    expect(message).toBe('Great One Donna');
  });

  it('compiles the message with the account-specified template', async () => {
    const message = await getMessageFromTemplates(accountId, 'test-template-1', {
      name: 'Donna',
      age: 22,
    });
    expect(message).toBe('Personalized template for Donna, 22.');
  });

  it('compiles the message with nasted object params', async () => {
    const data = {
      clinic: 'Donna dental',
      patient: {
        firstName: 'Michael',
        lastName: 'Myers',
        age: '40',
      },
    };
    const message = await getMessageFromTemplates(accountId, 'test-template-2', data);
    expect(message).toBe('Welcome Michael Myers, from Donna dental.');
  });
});

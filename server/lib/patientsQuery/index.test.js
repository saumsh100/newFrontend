
import omit from 'lodash/omit';
import { dateMock } from '@carecru/isomorphic';
import { Patient } from 'CareCruModels';
import { accountId } from '../../../tests/util/seedTestUsers';
import patientQueryBuilder from './index';

describe('#patientQueryBuilder', () => {
  beforeAll(() => {
    jest.spyOn(Patient, 'findAndCountAll');
    jest.spyOn(console, 'log');
    console.log.mockImplementation(() => {});
  });

  describe('Usage', () => {
    dateMock();

    afterEach(() => {
      Patient.findAndCountAll.mockClear();
      console.log.mockClear();
    });

    test('it is a function', () => {
      expect(typeof patientQueryBuilder).toEqual('function');
    });

    test('it throws an error if no accountId is supplied ', async () => {
      expect(patientQueryBuilder({})).rejects.toThrow('accountId is required');
    });

    test('it works with just accountId and default parameters', async () => {
      await patientQueryBuilder({ accountId });
      expect(Patient.findAndCountAll).toHaveBeenCalled();
      expect(omit(Patient.findAndCountAll.mock.calls[0][0], 'attributes')).toMatchSnapshot();
    });

    test('it works with segment', async () => {
      await patientQueryBuilder({
        accountId,
        segment: ['dueWithin', 30],
      });

      expect(Patient.findAndCountAll).toHaveBeenCalled();
      expect(omit(Patient.findAndCountAll.mock.calls[0][0], 'attributes')).toMatchSnapshot();
    });

    test('it works with segment + regular filters', async () => {
      await patientQueryBuilder({
        accountId,
        segment: ['dueWithin', 30],
        practitioner: 'f334b97f-21ec-42ad-828e-599bf4c99b1d',
        lastRecall: ['2018-11-10', '2018-12-10'],
        firstName: 'Aiden',
        lastName: 'Considine',
        age: [1, 2],
        city: 'Calgary',
        gender: 'Female',
      });

      expect(Patient.findAndCountAll).toHaveBeenCalled();
      expect(omit(Patient.findAndCountAll.mock.calls[0][0], 'attributes')).toMatchSnapshot();
    });

    describe('it works with sentRecalls', async () => {
      const assertSentRecalls = async (status, automated) => {
        await patientQueryBuilder({
          debug: true,
          accountId,
          sentRecalls: [status, automated, '2018-11-10', '2018-12-10'],
        });

        expect(Patient.findAndCountAll).toHaveBeenCalled();
        expect(omit(Patient.findAndCountAll.mock.calls[0][0], 'attributes')).toMatchSnapshot();
      };

      test('sent automated', async () => {
        await assertSentRecalls(true, true);
      });

      test('sent manual', async () => {
        await assertSentRecalls(true, false);
      });

      test('not sent automated', async () => {
        await assertSentRecalls(false, true);
      });

      test('not sent manual', async () => {
        await assertSentRecalls(false, false);
      });
    });

    test('it overrides the default parameters', async () => {
      await patientQueryBuilder({
        accountId,
        page: 2,
        limit: 30,
        order: ['middleName'],
      });

      expect(Patient.findAndCountAll).toHaveBeenCalled();
      expect(omit(Patient.findAndCountAll.mock.calls[0][0], 'attributes')).toMatchSnapshot();
    });
  });

  describe('DEBUG MODE', () => {
    beforeAll(async () => {
      await patientQueryBuilder({
        debug: true,
        accountId,
      });
    });

    test('calls console.log 3 times', () => {
      expect(console.log).toHaveBeenCalledTimes(3);
      expect(Patient.findAndCountAll).toHaveBeenCalled();
    });

    test('it console log the final query object', () => {
      // First console log for debug mode is the final query object
      const [res] = console.log.mock.calls[0];
      expect(omit(res, 'logging')).toMatchSnapshot();
    });

    test('it console log the queries made', () => {
      // we need to remove deletedAt query for matching snapshot
      const regex = /(\("Patient"."deletedAt).*("deletedAt" IS NULL\))/g;
      const [countQuery] = console.log.mock.calls[1];
      expect(countQuery.replace(regex, '')).toMatchSnapshot();
      const [recordSetQuery] = console.log.mock.calls[2];
      expect(recordSetQuery.replace(regex, '')).toMatchSnapshot();
    });
  });
});

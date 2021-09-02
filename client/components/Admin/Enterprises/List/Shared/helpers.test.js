import { formattedDate, getSortedRows, getAlertData } from './helpers';

const rows = [
  {
    id: '0a837bac-8a14-4c0c-b352-4b4e8e30e06a',
    createdAt: '2021-08-12T21:07:47.585Z',
    name: '01 e2e-AUTOMATION KELOWNA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  {
    id: '4e28e8ae-bb89-4a48-8d7e-36b4bfa458d1',
    createdAt: '2021-07-13T18:51:56.012Z',
    name: 'R_SYSTEMS',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  {
    id: '453368d8-953f-4c75-babb-49ae00cb4f5e',
    createdAt: '2020-09-17T22:39:56.120Z',
    name: 'Abeldent QA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
];

const mockSortedRowsASC = [
  {
    id: '0a837bac-8a14-4c0c-b352-4b4e8e30e06a',
    createdAt: '2021-08-12T21:07:47.585Z',
    name: '01 e2e-AUTOMATION KELOWNA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  {
    id: '453368d8-953f-4c75-babb-49ae00cb4f5e',
    createdAt: '2020-09-17T22:39:56.120Z',
    name: 'Abeldent QA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  {
    id: '4e28e8ae-bb89-4a48-8d7e-36b4bfa458d1',
    createdAt: '2021-07-13T18:51:56.012Z',
    name: 'R_SYSTEMS',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
];

const mockSortedRowsDESC = [
  {
    id: '4e28e8ae-bb89-4a48-8d7e-36b4bfa458d1',
    createdAt: '2021-07-13T18:51:56.012Z',
    name: 'R_SYSTEMS',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  {
    id: '453368d8-953f-4c75-babb-49ae00cb4f5e',
    createdAt: '2020-09-17T22:39:56.120Z',
    name: 'Abeldent QA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  {
    id: '0a837bac-8a14-4c0c-b352-4b4e8e30e06a',
    createdAt: '2021-08-12T21:07:47.585Z',
    name: '01 e2e-AUTOMATION KELOWNA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
];

describe('Admin helper functions', () => {
  describe('formattedDate function', () => {
    it('should format date', () => {
      const date = '2021-08-12T10:00:00.000Z';
      const timezone = 'America/Vancouver';
      expect(formattedDate(date, timezone)).toStrictEqual('Aug 12, 2021');
    });
  });

  describe('getSortedRows function', () => {
    it('should sort column by name in ascending order', () => {
      const sorted = [{ desc: false, id: 'name' }];

      expect(getSortedRows(rows, sorted)).toStrictEqual(mockSortedRowsASC);
    });

    it('should sort column by name in descending order', () => {
      const sorted = [{ desc: true, id: 'name' }];

      expect(getSortedRows(rows, sorted)).toStrictEqual(mockSortedRowsDESC);
    });
  });

  describe('getAlertData function', () => {
    it('should return success and error messages for update group', () => {
      expect(getAlertData('Group', 'update').success.body).toBe('Group name update success');
      expect(getAlertData('Group', 'update').error.body).toBe('Group name update failed');
    });

    it('should return success and error messages for delete group', () => {
      expect(getAlertData('Group', 'delete').success.body).toBe('Group delete success');
      expect(getAlertData('Group', 'delete').error.body).toBe('Group delete failed');
    });
  });
});

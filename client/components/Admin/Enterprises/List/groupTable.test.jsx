import React from 'react';
import { mount } from '../../../../../tests/util/test-utils';
import { GroupTable } from './GroupTable';
import reducer, { initialState, loginSuccess } from '../../../../reducers/auth';

const mockEnterpriseList = [
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
const loginSuccessAction = loginSuccess({
  userId: '6603fe66-aa03-4ffe-8de6-ce07a4ae9c5c',
  role: 'SUPERADMIN',
  enterpriseId: 'f1405909-55cf-422a-9ec0-9f80de72b0bf',
  accountId: 'c05ade0e-eb8a-44ed-bf3c-a83bfa4bc5a3',
  enterprise: {
    id: 'f1405909-55cf-422a-9ec0-9f80de72b0bf',
    name: 'Gallery Dental Inc.',
    plan: 'ENTERPRISE',
    createdAt: '2018-04-11T17:19:13.773Z',
    updatedAt: '2018-04-11T17:19:13.773Z',
    deletedAt: null,
  },
  user: {
    id: '6603fe66-aa03-4ffe-8de6-ce07a4ae9c5c',
    firstName: 'Justin',
    lastName: 'Sharp',
    username: 'justin@carecru.com',
  },
  sessionId: 'd15fbddc-f306-49e1-b736-78cb6a6166d4',
  timezone: 'America/Vancouver',
});
const mockOnFetchData = jest.fn();

describe('GroupTable Component', () => {
  let wrapper;

  beforeEach(() => {
    reducer(initialState, loginSuccessAction);
    const props = {
      data: mockEnterpriseList,
      pages: 10,
      handleRowClick: jest.fn(),
      onDeleteGroup: jest.fn(),
      onEditName: jest.fn(),
      onFetchData: mockOnFetchData,
      selectEnterprise: jest.fn(),
      timezone: 'America/Vancouver',
    };
    wrapper = mount(<GroupTable {...props} />);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  it('should render GroupTable component', () => {
    expect(wrapper).toBeTruthy();
    expect(mockOnFetchData).toHaveBeenCalled();
  });

  it('should have create table with default rows', () => {
    expect(wrapper.find('.rt-tr-group')).toHaveLength(20);
  });

  it('should render enterprises list', () => {
    const names = wrapper
      .find('TdComponent')
      .find('[data-testid="name"]')
      .map((node) => node.text());
    expect(names).toEqual(['01 e2e-AUTOMATION KELOWNA', 'R_SYSTEMS', 'Abeldent QA']);
  });

  it('should render select button', () => {
    expect(wrapper.find('TdComponent').find('IconButton')).toHaveLength(3);
  });
});

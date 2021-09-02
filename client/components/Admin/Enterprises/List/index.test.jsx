import React from 'react';
import thunkMiddleware from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Map } from 'immutable';
import { act } from 'react-dom/test-utils';
import { shallow } from '../../../../../tests/util/test-utils';
import { Enterprises } from './index';

const mockEnterprises = {
  '0a837bac-8a14-4c0c-b352-4b4e8e30e06a': {
    id: '0a837bac-8a14-4c0c-b352-4b4e8e30e06a',
    createdAt: '2021-08-12T21:07:47.585Z',
    name: '01 e2e-AUTOMATION KELOWNA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  '4e28e8ae-bb89-4a48-8d7e-36b4bfa458d1': {
    id: '4e28e8ae-bb89-4a48-8d7e-36b4bfa458d1',
    createdAt: '2021-07-13T18:51:56.012Z',
    name: 'R_SYSTEMS',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
  '453368d8-953f-4c75-babb-49ae00cb4f5e': {
    id: '453368d8-953f-4c75-babb-49ae00cb4f5e',
    createdAt: '2020-09-17T22:39:56.120Z',
    name: 'Abeldent QA',
    plan: 'ENTERPRISE',
    organization: null,
    csmAccountOwnerId: null,
    isFetching: false,
  },
};

const mockDeleteEntity = jest.fn(() => Promise.resolve());
const mockFetchEntitiesRequest = jest.fn(() => Promise.resolve());
const mockDeleteEntityRequest = jest.fn(() => Promise.resolve());
const mockUpdateEntityRequest = jest.fn(() => Promise.resolve());
const mockSwitchActiveEnterprise = jest.fn(() => Promise.resolve());
const mockNavigate = jest.fn();

const mountComponent = (store) => {
  const props = {
    deleteEntity: mockDeleteEntity,
    fetchEntitiesRequest: mockFetchEntitiesRequest,
    deleteEntityRequest: mockDeleteEntityRequest,
    updateEntityRequest: mockUpdateEntityRequest,
    switchActiveEnterprise: mockSwitchActiveEnterprise,
    navigate: mockNavigate,
    enterpriseList: Object.values(mockEnterprises),
    enterprisesFetched: false,
    enterprises: Map(mockEnterprises),
    location: {},
  };
  return shallow(<Enterprises store={store} history={{}} {...props} />);
};

describe('Enterprises Component', () => {
  let wrapper;
  let store;
  const mockStore = configureMockStore([thunkMiddleware]);

  beforeEach(() => {
    store = mockStore({
      entities: Map(),
      apiRequests: Map(),
    });
    wrapper = mountComponent(store);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  it('should render Enterprises component', () => {
    expect(wrapper.instance()).toBeInstanceOf(Enterprises);
  });

  it('should render Enterprises list', () => {
    expect(wrapper.instance()).toBeInstanceOf(Enterprises);
    expect(wrapper.find('.header_title').text()).toBe('Groups');
  });

  it('should redner action buttons', () => {
    const button = wrapper.find('.addButtonWrapper Button');
    expect(button).toHaveLength(3);
    expect(
      button
        .first()
        .dive()
        .text(),
    ).toBe('Add Group');
    expect(
      button
        .at(1)
        .dive()
        .text(),
    ).toBe('Add Practice');
    expect(
      button
        .last()
        .dive()
        .text(),
    ).toBe('Export Accounts');
  });

  it('should add Group', () => {
    wrapper
      .find('.addButtonWrapper Button')
      .first()
      .simulate('click', { stopPropagation: () => undefined });
    expect(mockNavigate).toHaveBeenCalledWith('/admin/enterprises/create');
  });

  it('should add Practice', () => {
    const mockSetActive = jest.spyOn(Enterprises.prototype, 'setActive');

    act(() => {
      wrapper
        .find('.addButtonWrapper Button')
        .at(1)
        .simulate('click', { stopPropagation: () => undefined });
    });
    expect(mockSetActive).toHaveBeenCalled();
    act(() => {
      wrapper.setProps({
        enterprisesFetched: true,
      });
    });
    expect(wrapper.find('DialogBox')).toHaveLength(1);
  });

  it('should export accounts', () => {
    const mockOnClickExportData = jest.spyOn(Enterprises.prototype, 'handleOnClickExportData');

    wrapper
      .find('.addButtonWrapper Button')
      .last()
      .simulate('click', { stopPropagation: () => undefined });
    expect(mockOnClickExportData).toHaveBeenCalled();
  });

  it('should list enterprises', async () => {
    const stateData = { filtered: [], pageSize: 0, page: 20, sorted: [] };
    const mockGetFilteredData = Promise.resolve({
      rows: Object.values(mockEnterprises),
      pages: 10,
      enterpriseIds: Object.keys(mockEnterprises),
    });

    const componentInstance = wrapper.instance();
    Enterprises.prototype.getFilteredData = jest.fn(() => mockGetFilteredData);

    componentInstance.onFetchData(stateData);
    expect(componentInstance.state.loaded).toBeFalsy();
    await mockGetFilteredData;

    expect(componentInstance.state.data).toStrictEqual(Object.values(mockEnterprises));
    expect(componentInstance.state.enterpriseIds).toStrictEqual(Object.keys(mockEnterprises));
    expect(componentInstance.state.loaded).toBe(true);
  });

  it('should toggle rows', () => {
    wrapper.instance().handleRowClick({ viewIndex: 0 });
    expect(wrapper.state('expanded')).toStrictEqual({ 0: true });
  });

  it('should change values on Edit Groupd', () => {
    const values = mockEnterprises['0a837bac-8a14-4c0c-b352-4b4e8e30e06a'];
    values.name = 'CareCrue';

    wrapper.instance().handleEditNameSubmit(0, values);
    expect(mockUpdateEntityRequest).toHaveBeenCalled();
  });

  it('should select an enterprise', () => {
    wrapper.instance().selectEnterprise('0a837bac-8a14-4c0c-b352-4b4e8e30e06a');
    expect(mockSwitchActiveEnterprise).toHaveBeenCalled();
  });

  it('should delete an enterprise', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    Enterprises.prototype.deleteConfirmation = confirmSpy.mockImplementation(jest.fn(() => true));

    const values = mockEnterprises['0a837bac-8a14-4c0c-b352-4b4e8e30e06a'];

    wrapper.instance().handleDeleteGroup(0, values);
    expect(mockDeleteEntityRequest).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});

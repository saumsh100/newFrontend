import React from 'react';
import ManageCell from './ManageCell';
import { mount } from '../../../../../tests/util/test-utils';
import reducer, {
  createInitialEntitiesState,
  receiveEntities,
} from '../../../../reducers/entities';

const initialState = createInitialEntitiesState();

const receiveEntitiesAction = receiveEntities({
  entities: {
    accounts: {
      123: {
        id: '123',
        name: 'test',
      },
    },
  },
});

const enterprise = {
  createdAt: '2021-02-17T06:29:42.721Z',
  csmAccountOwnerId: null,
  id: '712fa144-1be2-495d-929a-5fa6649664a2',
  isFetching: false,
  name: 'Test enterprise',
  organization: null,
  plan: 'ENTERPRISE',
};

describe('ManageCell Component', () => {
  let wrapper;

  const mountCompnent = (props) =>
    mount(<ManageCell index={0} label="Group" value={enterprise} {...props} />);

  beforeEach(() => {
    reducer(initialState, receiveEntitiesAction);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  it('should render ManageCell component', () => {
    wrapper = mountCompnent();
    expect(wrapper.length).toBe(1);
  });

  it('should render the ellipsis icon', () => {
    wrapper = mountCompnent();
    expect(wrapper.find('EllipsisIcon')).toBeTruthy();
  });

  it('should render the dropdown menu', () => {
    wrapper = mountCompnent();
    expect(wrapper.find('.dd-menu')).toBeTruthy();
  });

  it('should call the the onEdit method', () => {
    const onEdit = jest.fn();
    wrapper = mountCompnent({ onEdit });
    wrapper.find('button').simulate('click');
    const button = wrapper.find('button.actionItem').first();
    expect(button.text()).toBe('Edit Group');
    button.simulate('click');
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('should call the the onDelete method', () => {
    const onDelete = jest.fn();
    wrapper = mountCompnent({ onDelete });
    wrapper.find('button').simulate('click');
    const button = wrapper.find('button.actionItem').at(1);
    expect(button.text()).toBe('Delete');
    button.simulate('click');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

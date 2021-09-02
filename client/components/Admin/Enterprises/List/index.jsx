import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { push } from 'connected-react-router';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import {
  deleteEntityRequest,
  fetchEntitiesRequest,
  updateEntityRequest,
} from '../../../../thunks/fetchEntities';
import { deleteEntity } from '../../../../reducers/entities';
import { Button, DialogBox, Card, Loading, RemoteSubmitButton } from '../../../library';
import CreateAccount from '../CreateAccount';
import withAuthProps from '../../../../hocs/withAuthProps';
import { switchActiveEnterprise } from '../../../../thunks/auth';
import { getEntities, getAlertData, getSortedRows } from './Shared/helpers';
import GroupTableComponent from './GroupTable';
import styles from './styles.scss';
import { httpClient } from '../../../../util/httpClient';
import { enterpriseShape } from '../../../library/PropTypeShapes';
import EnterpriseForm from '../CreateAccount/EnterpriseForm';

export class Enterprises extends Component {
  editFormName = 'editNameForm';

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      data: [],
      defaultPageSize: 20,
      editGroupNameActive: false,
      enterpriseIds: [],
      expanded: {},
      isLoading: false,
      loaded: false,
      pages: 10,
      selectedGroup: null,
      selectedGroupIndex: null,
    };
  }

  handleRowClick(rowInfo) {
    const { expanded } = this.state;

    this.setState({
      expanded: rowInfo && !(rowInfo.viewIndex in expanded) ? { [rowInfo.viewIndex]: true } : {},
    });
  }

  handleOnClickExportData(e) {
    this.setState({ isLoading: true });
    e.stopPropagation();
    httpClient({ responseType: 'blob' })
      .post('/api/enterprises/export', { ids: this.state.enterpriseIds })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'accounts_export.csv');
        link.click();
      })
      .catch(console.error)
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  handleEditNameSubmit(index, values) {
    this.props
      .updateEntityRequest({
        values,
        id: 'enterprises',
        key: 'enterprises',
        url: `/api/enterprises/${values.id}`,
        alert: getAlertData('Group', 'update'),
      })
      .then(({ enterprises }) => {
        this.setState(({ data: prevStateData }) => {
          const data = [...prevStateData];
          data[index] = enterprises[values.id];
          return {
            selectedGroup: null,
            selectedGroupIndex: null,
            editGroupNameActive: false,
            data,
          };
        });
      });
  }

  handleDeleteGroup(index, values) {
    if (this.deleteConfirmation(values)) {
      this.props
        .deleteEntityRequest({
          values,
          id: values.id,
          key: 'enterprises',
          url: `/api/enterprises/${values.id}`,
          alert: getAlertData('Group', 'delete'),
        })
        .then(() => {
          this.setState(({ data: prevStateData }) => {
            const data = [...prevStateData].filter((item) => item.id !== values.id);
            this.props.deleteEntity({
              key: 'enterprises',
              id: values.id,
            });
            return {
              data,
            };
          });
        });
    }
  }

  handleEditName(index, value) {
    this.setState({
      selectedGroupIndex: index,
      selectedGroup: value,
    });
    this.setEditNameActive();
  }

  onFetchData({ filtered, pageSize, page, sorted }) {
    this.setState({
      loaded: false,
    });

    this.getFilteredData(filtered, pageSize, page, sorted)
      .then((res) => {
        this.setState({
          data: res.rows,
          enterpriseIds: res.enterpriseIds,
          pages: res.pages,
          loaded: true,
        });
      })
      .catch(() => {
        this.setState({
          data: [],
          enterpriseIds: [],
          loaded: true,
        });
      });
  }

  getEnterprises() {
    return new Promise((resolve, reject) => {
      const { enterpriseList } = this.props;

      if (isEmpty(enterpriseList)) {
        this.props
          .fetchEntitiesRequest({
            id: 'fetchingEnterprises',
            key: 'enterprises',
          })
          .then((data) => {
            resolve(getEntities(data));
          })
          .catch((err) => reject(err));
      } else {
        resolve(enterpriseList);
      }
    });
  }

  get editGroupNameActions() {
    return [
      {
        label: 'Cancel',
        onClick: () => this.setEditNameActive(),
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: this.editFormName,
        },
      },
    ];
  }

  setEditNameActive() {
    this.setState((prevState) => ({
      editGroupNameActive: !prevState.editGroupNameActive,
    }));
  }

  setActive() {
    this.setState((prevState) => ({
      active: !prevState.active,
    }));
  }

  getFilteredData([filter], pageSize, page, sorted) {
    const resolvePaginationData = (resolve, rows, sortedValues, enterpriseIds = []) => {
      const sortedRows = getSortedRows(rows, sortedValues);
      const sliceStartIdex = pageSize * page;

      resolve({
        rows: sortedRows.slice(sliceStartIdex, sliceStartIdex + pageSize),
        pages: Math.ceil(sortedRows.length / pageSize),
        enterpriseIds,
      });
    };

    return new Promise((resolve, reject) => {
      if (isEmpty(filter)) {
        this.getEnterprises().then((rows) => {
          resolvePaginationData(resolve, rows, sorted);
        });
      } else {
        const { value: keywords } = filter;

        httpClient({
          params: {
            keywords,
          },
        })
          .get('/api/enterprises/search')
          .then(({ data: { enterprise, accounts } }) => {
            const rows = this.props.enterpriseList.filter((item) => {
              const filteredAccountEnterpriseIds = accounts.result.map(
                (accountId) => accounts.entities.accounts[accountId].enterpriseId,
              );
              return (
                enterprise.result.includes(item.id) ||
                filteredAccountEnterpriseIds.includes(item.id)
              );
            });

            resolvePaginationData(resolve, rows, sorted, enterprise.result);
          })
          .catch((err) => reject(err));
      }
    });
  }

  deleteConfirmation(values) {
    return window.confirm(`Are you sure you want to delete ${values.name}?`);
  }

  selectEnterprise(enterpriseId) {
    this.props.switchActiveEnterprise(enterpriseId, this.props.location.pathname);
  }

  render() {
    const { enterprises } = this.props;
    const baseUrl = (path = '') => `/admin/enterprises${path}`;

    const renderAddButton = () => (
      <div className={styles.addButtonWrapper}>
        <Button
          color="darkblue"
          onClick={(e) => {
            e.stopPropagation();
            this.props.navigate(baseUrl('/create'));
          }}
        >
          Add Group
        </Button>
        <Button
          color="darkblue"
          onClick={(e) => {
            e.stopPropagation();
            this.setActive();
          }}
        >
          Add Practice
        </Button>
        <Button
          disabled={this.state.isLoading}
          color="darkblue"
          onClick={(event) => this.handleOnClickExportData(event)}
        >
          {this.state.isLoading && <Loading smallSize as="span" disableFlex />}
          Export Accounts
        </Button>
      </div>
    );

    return (
      <div className={styles.enterpriseContainer}>
        <Card className={styles.enterpriseCard} runAnimation loaded={this.state.loaded}>
          <div className={styles.header}>
            <span className={styles.header_title}>Groups</span>
            <div>{renderAddButton()}</div>
          </div>

          <div className={styles.enterpriseTable}>
            <GroupTableComponent
              data={this.state.data}
              pages={this.state.pages}
              defaultPageSize={this.state.defaultPageSize}
              loaded={!this.state.loaded}
              expanded={this.state.expanded}
              handleRowClick={(rowInfo) => this.handleRowClick(rowInfo)}
              onEditName={(index, value) => this.handleEditName(index, value)}
              onDeleteGroup={(index, value) => this.handleDeleteGroup(index, value)}
              selectEnterprise={(enterpriseId) => this.selectEnterprise(enterpriseId)}
              onFetchData={debounce((state) => this.onFetchData(state), 500)}
            />
          </div>
        </Card>
        {this.props.enterprisesFetched && (
          <DialogBox
            bodyStyles={styles.newCustomerModal}
            active={this.state.active}
            onEscKeyDown={() => this.setActive()}
            onOverlayClick={() => this.setActive()}
            className={styles.customDialog}
            title="New Practice Setup"
          >
            <CreateAccount
              key="Create Account Component"
              enterprises={enterprises.toArray()}
              setActive={() => this.setActive()}
              selectEnterprise={(enterpriseId) => this.selectEnterprise(enterpriseId)}
              active={this.state.active}
            />
          </DialogBox>
        )}
        {this.state.editGroupNameActive && (
          <DialogBox
            actions={this.editGroupNameActions}
            title="Edit Group"
            type="small"
            active={this.state.editGroupNameActive}
            onEscKeyDown={() => this.setEditNameActive()}
            onOverlayClick={() => this.setEditNameActive()}
          >
            <EnterpriseForm
              key="Edit Group"
              label="Group"
              formName={this.editFormName}
              index={this.state.selectedGroupIndex}
              initialValues={this.state.selectedGroup}
              onSubmit={(index, values) => this.handleEditNameSubmit(index, values)}
            />
          </DialogBox>
        )}
      </div>
    );
  }
}

Enterprises.propTypes = {
  deleteEntity: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  enterprises: PropTypes.instanceOf(Map),
  enterpriseList: PropTypes.arrayOf(PropTypes.shape(enterpriseShape)),
  location: PropTypes.objectOf(PropTypes.string).isRequired,
  switchActiveEnterprise: PropTypes.func.isRequired,
  enterprisesFetched: PropTypes.bool,
};

Enterprises.defaultProps = {
  enterprisesFetched: false,
  enterprises: null,
  enterpriseList: [],
};

function mapStateToProps({ entities, apiRequests }) {
  const enterprisesFetched =
    apiRequests.get('fetchingEnterprises') && apiRequests.get('fetchingEnterprises').wasFetched;

  const enterpriseModels = entities.getIn(['enterprises', 'models']);

  return {
    enterprises: enterpriseModels,
    enterpriseList: enterpriseModels.toArray().map((data) => data.toJSON()),
    enterprisesFetched,
  };
}

const dispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      deleteEntity,
      fetchEntitiesRequest,
      deleteEntityRequest,
      updateEntityRequest,
      switchActiveEnterprise,
      navigate: push,
    },
    dispatch,
  );

export default connect(mapStateToProps, dispatchToProps)(withAuthProps(Enterprises));

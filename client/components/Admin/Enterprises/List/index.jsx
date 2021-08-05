import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { push } from 'connected-react-router';
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
import { getEntities } from './Shared/helpers';
import GroupTable from './GroupTable';
import styles from './styles.scss';
import { httpClient } from '../../../../util/httpClient';
import RenameForm from '../CreateAccount/RenameForm';

const getAlertData = (action) => ({
  success: {
    body: `Group name ${action} success`,
  },
  error: {
    body: `Group name ${action} failed`,
  },
});

class Enterprises extends Component {
  editFormName = 'editNameForm';

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      expanded: {},
      loaded: false,
      data: [],
      query: [],
      isLoading: false,
      selectedGroupIndex: null,
      selectedGroup: null,
      editGroupNameActive: false,
    };
  }

  componentDidMount() {
    this.props
      .fetchEntitiesRequest({
        id: 'fetchingEnterprises',
        key: 'enterprises',
      })
      .then((data) => {
        this.setState({
          loaded: true,
          data: getEntities(data),
        });
      });
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
      .post('/api/enterprises/export', { ids: this.state.query })
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
        alert: getAlertData('update'),
      })
      .then(({ enterprises }) => {
        this.setState(({ data: prevStateData }) => {
          const data = [...prevStateData];
          data[index].name = enterprises[values.id].name;
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
    const confirmDelete = window.confirm(`Are you sure you want to delete ${values.name}?`);

    if (confirmDelete) {
      this.props
        .deleteEntityRequest({
          values,
          id: values.id,
          key: 'enterprises',
          url: `/api/enterprises/${values.id}`,
          alert: getAlertData('delete'),
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

  setQuery(query) {
    this.setState({
      query,
      expanded: {},
    });
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
            <GroupTable
              data={this.state.data}
              loaded={!this.state.loaded}
              expanded={this.state.expanded}
              handleRowClick={(rowInfo) => this.handleRowClick(rowInfo)}
              onEditName={(index, value) => this.handleEditName(index, value)}
              onDeleteGroup={(index, value) => this.handleDeleteGroup(index, value)}
              selectEnterprise={(enterpriseId) => this.selectEnterprise(enterpriseId)}
              setQuery={(query) => this.setQuery(query)}
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
            <RenameForm
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
  location: PropTypes.objectOf(PropTypes.string).isRequired,
  switchActiveEnterprise: PropTypes.func.isRequired,
  enterprisesFetched: PropTypes.bool,
};

Enterprises.defaultProps = {
  enterprisesFetched: false,
  enterprises: null,
};

function mapStateToProps({ entities, apiRequests }) {
  const enterprisesFetched =
    apiRequests.get('fetchingEnterprises') && apiRequests.get('fetchingEnterprises').wasFetched;

  return {
    enterprises: entities.getIn(['enterprises', 'models']),
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

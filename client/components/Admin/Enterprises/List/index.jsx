
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  deleteEntityRequest,
  fetchEntitiesRequest,
} from '../../../../thunks/fetchEntities';
import { Button, DialogBox, Card } from '../../../library/index';
import CreateAccount from '../CreateAccount';
import withAuthProps from '../../../../hocs/withAuthProps';
import Enterprise from '../../../../entities/models/Enterprise';
import { switchActiveEnterprise } from '../../../../thunks/auth';
import { getEntities } from './Shared/helpers';
import GroupTable from './GroupTable';
import styles from './styles.scss';

class EnterpriseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      expanded: {},
      loaded: false,
      data: [],
    };
    this.setActive = this.setActive.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.selectEnterprise = this.selectEnterprise.bind(this);
  }

  componentDidMount() {
    this.props
      .fetchEntitiesRequest({ id: 'fetchingEnterprises', key: 'enterprises' })
      .then((data) => {
        this.setState({
          loaded: true,
          data: getEntities(data),
        });
      });
  }

  setActive() {
    this.setState({
      active: !this.state.active,
    });
  }

  selectEnterprise(enterpriseId) {
    this.props.switchActiveEnterprise(
      enterpriseId,
      this.props.location.pathname,
    );
  }

  handleRowClick(rowInfo) {
    const { expanded } = this.state;

    this.setState({
      expanded:
        rowInfo && !expanded.hasOwnProperty(rowInfo.viewIndex)
          ? { [rowInfo.viewIndex]: true }
          : {},
    });
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
          Add Customer
        </Button>
      </div>
    );

    return (
      <div className={styles.enterpriseContainer}>
        <Card
          className={styles.enterpriseCard}
          runAnimation
          loaded={this.state.loaded}
        >
          <div className={styles.header}>
            <span className={styles.header_title}>Groups</span>
            <div>{renderAddButton()}</div>
          </div>

          <div className={styles.enterpriseTable}>
            <GroupTable
              data={this.state.data}
              loaded={!this.state.loaded}
              expanded={this.state.expanded}
              handleRowClick={this.handleRowClick}
              selectEnterprise={this.selectEnterprise}
            />
          </div>
        </Card>
        <DialogBox
          active={this.state.active}
          onEscKeyDown={this.setActive}
          onOverlayClick={this.setActive}
          className={styles.customDialog}
          title="New Customer Setup"
        >
          {this.props.enterprisesFetched ? (
            <CreateAccount
              enterprises={enterprises.toArray()}
              setActive={this.setActive}
              selectEnterprise={this.selectEnterprise}
            />
          ) : null}
        </DialogBox>
      </div>
    );
  }
}

EnterpriseList.propTypes = {
  fetchEntitiesRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  enterprises: PropTypes.arrayOf(Enterprise),
  location: PropTypes.objectOf(PropTypes.string),
  switchActiveEnterprise: PropTypes.func,
  enterpriseId: PropTypes.string,
  enterprisesFetched: PropTypes.bool,
};

function mapStateToProps({ entities, apiRequests }) {
  const enterprisesFetched =
    apiRequests.get('fetchingEnterprises') &&
    apiRequests.get('fetchingEnterprises').wasFetched;

  return {
    enterprises: entities.getIn(['enterprises', 'models']),
    enterprisesFetched,
  };
}

const dispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchEntitiesRequest,
      deleteEntityRequest,
      switchActiveEnterprise,
      navigate: push,
    },
    dispatch,
  );

export default withAuthProps(connect(
  mapStateToProps,
  dispatchToProps,
)(EnterpriseList));

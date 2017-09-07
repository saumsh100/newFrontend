
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { fetchEntities, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import { VButton, Modal } from '../../../library/index';
import PageContainer from '../../General/PageContainer';
import EditableList from '../../General/EditableList';
import CreateAccount from '../CreateAccount';
import { getCollection } from '../../../Utils';
import withAuthProps from '../../../../hocs/withAuthProps';
import { switchActiveEnterprise } from '../../../../thunks/auth';
import styles from './styles.scss';
import DialogBox from "../../../library/DialogBox/index";

class EnterpriseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.setActive = this.setActive.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'enterprises' });
  }

  setActive() {
    this.setState({
      active: !this.state.active,
    });
  }

  selectEnterprise(enterpriseId) {
    this.props.switchActiveEnterprise(enterpriseId, this.props.location.pathname);
  }

  render() {
    const { enterprises, enterpriseId } = this.props;

    const baseUrl = (path = '') => `/admin/enterprises${path}`;

    const deleteRequest = ({ id }) => this.props.deleteEntityRequest({ key: 'enterprises', id });
    const navigateToEditPage = ({ id }) => this.props.navigate(baseUrl(`/${id}/edit`));

    const breadcrumbs = [
      { icon: 'home', key: 'home', home: true, link: '/admin' },
      { title: 'Enterprises', key: 'enterprises', link: '/admin/enterprises' },
    ];

    const renderAddButton = () => {
      return (<div>
        <VButton
          as={Link}
          icon="plus"
          positive
          rounded
          compact
          to={baseUrl('/create')}
        >Add Enterprise</VButton>
        <VButton
          icon="plus"
          positive
          rounded
          compact
          onClick={(e) => {
            e.stopPropagation();
            this.setActive();
          }}
        >Add Customer</VButton>
      </div>);
    }


    const renderListItem = ({ id, name }) =>
      <strong><Link to={baseUrl(`/${id}/accounts`)} className={styles.link}>{name}</Link></strong>;

    return (
      <div>
        <PageContainer title="Enterprises" breadcrumbs={breadcrumbs} renderButtons={renderAddButton}>
          <EditableList
            items={enterprises}
            render={renderListItem}
            confirm={item => `Do you really want to delete "${item.name}" Enterprise?`}
            onDelete={deleteRequest}
            onEdit={navigateToEditPage}
          />
          <br /><br />
          <br /><br />
          <span>Switch Enterprise</span>
          {enterprises ? (
            <select onChange={e => this.selectEnterprise(e.target.value)} value={enterpriseId}>
              { enterprises.map(enterprise =>
                <option key={enterprise.id} value={enterprise.id}>{enterprise.name}</option>
                ) }
            </select>
            ) : null}
        </PageContainer>
        <DialogBox
          active={this.state.active}
          onEscKeyDown={this.setActive}
          onOverlayClick={this.setActive}
          className={styles.customDialog}
        >
          <CreateAccount
            enterprises={enterprises}
            setActive={this.setActive}
          />
        </DialogBox>
      </div>
    );
  }
}

EnterpriseList.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  enterprises: PropTypes.arrayOf(
    PropTypes.object
  ),
};

const stateToProps = state => ({
  enterprises: getCollection(state, 'enterprises'),
});

const dispatchToProps = dispatch =>
  bindActionCreators({
    fetchEntities,
    deleteEntityRequest,
    switchActiveEnterprise,
    navigate: push,
  }, dispatch);

export default withAuthProps(connect(stateToProps, dispatchToProps)(EnterpriseList));


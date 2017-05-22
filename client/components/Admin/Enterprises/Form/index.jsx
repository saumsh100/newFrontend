import React, { Component } from 'react';
import { Record } from 'immutable';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { filter } from 'lodash';
import { fetchEntities, createEntityRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import {
  Card,
  CardHeader,
  Form,
  Field,
  List,
  ListItem,
  Row,
  Col,
  VButton,
  Breadcrumbs,
} from '../../../library/index';
import styles from './styles.scss';

const enterprisesListPath = '/admin/enterprises/list';

class EnterpriseForm extends Component {

  componentWillMount() {
    const { isFetching, isCreate, enterpriseId } = this.props;

    // Enterprises not fetched yet
    if (isFetching) {
      this.props.fetchEntities({ key: 'enterprises' });

      if (!isCreate) {
        this.props.fetchEntities({ key: 'accounts', url: `/api/enterprises/${enterpriseId}/accounts` });
      }
    }
  }

  onSubmit(entityData) {
    const { isCreate, navigate, enterprise } = this.props;
    const key = 'enterprises';

    const promise = isCreate ?
      this.props.createEntityRequest({ key, entityData }) :
      this.props.updateEntityRequest({ key, values: entityData, model: enterprise });

    promise.then(() => navigate(enterprisesListPath));
  }

  render() {
    const { enterprise, isFetching, isCreate, accounts } = this.props;

    const breadcrumbs = () => [
      { icon: 'home', key: 'home', home: true, link: '/admin' },
      { title: 'Enterprises', key: 'enterprises', link: '/admin/enterprises' },

      ...(isCreate ? [
        { title: 'Add', key: 'add' },
      ] : [
        { title: `${enterprise.get('name')} » edit`, key: enterprise.get('id') },
      ]),
    ];

    return (
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          {!isFetching ? (
            <div>
              <CardHeader
                className={styles.cardHeader}
                title={isCreate ? 'Add enterprise' : `Edit: ${enterprise.get('name')}`}
              />

              <div className={styles.cardContent}>

                <div>
                  <Breadcrumbs items={breadcrumbs()} />
                </div>

                <Form
                  form="enterpriseForm"
                  initialValues={{ name: enterprise && enterprise.get('name') }}
                  onSubmit={model => this.onSubmit(model)}
                >
                  <Field required name="name" label="Name" />

                  <Row middle="md">
                    <Col md={8}><h3>Accounts</h3></Col>
                    <Col md={4} className={styles.headerButtons} >
                      <VButton
                        icon="plus-circle"
                        rounded
                        compact
                        positive
                      >Add Accout</VButton>
                    </Col>
                  </Row>
                  <List>
                    { accounts.map(({ name, logo, id }) => (
                      <ListItem key={id} >
                        <img src={logo} alt={name} className={styles.accoutLogo}/>
                        { name }
                      </ListItem>
                    )) }
                  </List>
                </Form>
              </div>
            </div>
          ) : <div>Loading...</div>}
        </Card>
      </div>
    );
  }
}

EnterpriseForm.propTypes = {
  isCreate: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  enterprise: PropTypes.instanceOf(Record),
  accounts: PropTypes.arrayOf(PropTypes.object),
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  enterpriseId: PropTypes.string,
};

const stateToProps = (state, { match: { params: { enterpriseId } } }) => {
  const enterprise = enterpriseId ?
    state.entities.getIn(['enterprises', 'models', enterpriseId]) :
    null;

  const accounts = enterpriseId ?
    filter(state.entities.getIn(['accounts', 'models']).toJS(), { enterpriseId }) :
    [];

  return {
    enterpriseId,
    isCreate: !enterpriseId,
    enterprise,
    accounts,
    isFetching: !!(enterpriseId && !enterprise),
  };
};

const dispatchToProps = dispatch =>
  bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    navigate: push,
  }, dispatch);

export default connect(stateToProps, dispatchToProps)(EnterpriseForm);


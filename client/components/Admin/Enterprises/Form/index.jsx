import React, { Component } from 'react';
import { Record } from 'immutable';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { fetchEntities, createEntityRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Card, CardHeader, Icon, Form, Field } from '../../../library/index';
import styles from './styles.scss';

const enterprisesListPath = '/admin/enterprises/list';

class EnterpriseForm extends Component {

  componentWillMount() {
    const { isFetching } = this.props;

    // Enterprises not fetched yet
    if (isFetching) {
      this.props.fetchEntities({ key: 'enterprises' });
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
    const { enterprise, isFetching, isCreate } = this.props;

    const renderEditTitle = () => (isFetching ?
      (<span>Loading...</span>) :

      (<span>
        <span>{enterprise.get('name')}</span>
        <Icon icon="caret-right" className={styles.caret} />
        <span>Edit</span>
      </span>));

    const renderTitle = () =>
      <span>
        <Link to={enterprisesListPath} className={styles.headerLink}>
          <Icon icon="level-up" /> {' '}
          Enterprises
        </Link>
        <Icon icon="caret-right" className={styles.caret} />
        {isCreate ? (<span>Create</span>) : renderEditTitle()}
      </span>;

    return (
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader} title={renderTitle()} />

          <div className={styles.cardContent}>
            {!isFetching ? (
              <Form
                form="enterpriseForm"
                initialValues={{ name: enterprise && enterprise.get('name') }}
                onSubmit={model => this.onSubmit(model)}
              >
                <Field required name="name" label="Name" />
              </Form>
            ) :
              <div>Loading...</div>
            }
          </div>
        </Card>
      </div>
    );
  }
}

EnterpriseForm.propTypes = {
  isCreate: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  enterprise: PropTypes.instanceOf(Record),
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

const stateToProps = (state, { match: { params: { enterpriseId } } }) => {
  const enterprise = enterpriseId ?
    state.entities.getIn(['enterprises', 'models', enterpriseId]) :
    null;

  return {
    isCreate: !enterpriseId,
    enterprise,
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


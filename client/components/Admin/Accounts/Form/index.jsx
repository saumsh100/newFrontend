import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchEntities, createEntityRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Form, Field } from '../../../library/index';
import PageContainer from '../../General/PageContainer';
import { getModel } from '../../../Utils';
import styles from '../../General/page-container.scss';

const enterprisesPath = (path = '') => `/admin/enterprises${path}`;


const EnterpriseForm = (props) => {
  const { enterprise, isCreate, navigate, account } = props;
  if (!enterprise) {
    return null;
  }

  const accountsPath = (path = '') => enterprisesPath(`/${enterprise.id}${path}`);

  const onSubmit = (entityData) => {
    const key = 'accounts';

    const promise = isCreate ?
      props.createEntityRequest({
        key,
        entityData,
        url: `/api/enterprises/${enterprise.id}/accounts`,
      }) :
      props.updateEntityRequest({
        key,
        values: entityData,
        url: `/api/enterprises/${enterprise.id}/accounts/${account.id}`,
      });

    promise.then(() => navigate(accountsPath('/accounts')));
  };

  const pageTitle = () => (isCreate ?
      'Add Account' :
      `${account.name} » Edit`
  );

  const breadcrumbs = () => [
    { icon: 'home', key: 'home', home: true, link: '/admin' },
    { title: 'Enterprises', key: 'enterprises', link: enterprisesPath('/list') },
    { title: enterprise.name, key: enterprise.id, link: accountsPath('/accounts') },
    { title: pageTitle(), key: isCreate ? 'add' : account.id },
  ];

  return (
    (account || isCreate) ? (
      <PageContainer title={pageTitle()} breadcrumbs={breadcrumbs()}>
        <Form
          className={styles.form}
          form="accountForm"
          initialValues={{
            name: account && account.name,
          }}
          onSubmit={onSubmit}
        >
          <Field required name="name" label="Name" />
        </Form>
      </PageContainer>
    ) : (
      <div>Loading</div>
    )
  );
};

const modelType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

EnterpriseForm.propTypes = {
  isCreate: PropTypes.bool.isRequired,
  enterprise: modelType,
  account: modelType,
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  accountId: PropTypes.string,
};

const stateToProps = (state, { match: { params: { enterpriseId, accountId } } }) => ({
  enterpriseId,
  accountId,
  isCreate: !accountId,
  enterprise: getModel(state, 'enterprises', enterpriseId),
  account: getModel(state, 'accounts', accountId),
});

const dispatchToProps = dispatch =>
  bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    navigate: push,
  }, dispatch);

export default connect(stateToProps, dispatchToProps)(EnterpriseForm);

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
} from '../../../../thunks/fetchEntities';
import { Form, Field } from '../../../library/index';
import PageContainer from '../../General/PageContainer';
import { getModel } from '../../../Utils';
import styles from '../../General/page-container.scss';

const enterprisesListPath = '/admin/enterprises/list';

const EnterpriseForm = (props) => {
  const { enterprise, isCreate, navigate } = props;

  const onSubmit = (entityData) => {
    const key = 'enterprises';

    const promise = isCreate
      ? props.createEntityRequest({ key, entityData })
      : props.updateEntityRequest({
          key,
          values: entityData,
          url: `/api/enterprises/${enterprise.id}`,
        });

    promise.then(() => navigate(enterprisesListPath));
  };

  const pageTitle = () => (isCreate ? 'Add Enterprise' : `${enterprise.name} » Edit`);

  const breadcrumbs = () => [
    {
      icon: 'home',
      key: 'home',
      home: true,
      link: '/admin',
    },
    { title: 'Enterprises', key: 'enterprises', link: enterprisesListPath },
    { title: pageTitle(), key: isCreate ? 'add' : enterprise.id },
  ];

  return enterprise || isCreate ? (
    <PageContainer title={pageTitle()} breadcrumbs={breadcrumbs()}>
      <Form
        form="enterpriseForm"
        initialValues={{
          name: enterprise?.name,
          plan: enterprise?.plan,
          organization: enterprise?.organization,
          csmAccountOwnerId: enterprise?.csmAccountOwnerId,
        }}
        className={styles.form}
        onSubmit={onSubmit}
      >
        <Field
          required
          name="plan"
          label="Plan"
          component="DropdownSelect"
          options={[{ value: 'ENTERPRISE' }, { value: 'GROWTH' }]}
        />
        <Field required name="name" label="Name" />
        <Field required name="organization" label="Organization" />
        <Field
          label="CSM Account Owner"
          name="csmAccountOwnerId"
          component="SuperAdminPicker"
          search="label"
        />
      </Form>
    </PageContainer>
  ) : (
    <div>Loading</div>
  );
};

EnterpriseForm.propTypes = {
  isCreate: PropTypes.bool.isRequired,
  enterprise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    plan: PropTypes.string,
    organization: PropTypes.string,
    csmAccountOwnerId: PropTypes.string,
  }).isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

const stateToProps = (
  state,
  {
    match: {
      params: { enterpriseId },
    },
  },
) => ({
  enterpriseId,
  isCreate: !enterpriseId,
  enterprise: getModel(state, 'enterprises', enterpriseId),
});

const dispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchEntities,
      createEntityRequest,
      updateEntityRequest,
      navigate: push,
    },
    dispatch,
  );

export default connect(stateToProps, dispatchToProps)(EnterpriseForm);

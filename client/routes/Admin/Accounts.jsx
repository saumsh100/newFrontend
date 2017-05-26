import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect, Route } from 'react-router-dom';
import Container from '../../containers/EnterprisesContainer';
import List from '../../components/Admin/Accounts/List';
import Form from '../../components/Admin/Accounts/Form';

const Accounts = (props) => {
  const { match: { params: { enterpriseId } } } = props;

  const getPath = (id, path = '') =>
    `/admin/enterprises/${id}/accounts${path}`;

  const base = (path = '') => getPath(':enterpriseId', path);

  return (
    <Container {...props}>
      <Switch>
        <Redirect exact from={base()} to={getPath(enterpriseId, '/list')} />
        <Route exact path={base('/list')} component={List} />
        <Route exact path={base('/:accountId/edit')} component={Form} />
        <Route exact path={base('/create')} component={Form} />
      </Switch>
    </Container>
  );
};

const { shape, string } = PropTypes;

Accounts.propTypes = {
  match: shape({
    params: shape({
      enterpriseId: string,
    }),
  }),
};

export default Accounts;

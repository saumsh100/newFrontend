
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LazyRoute from '../LazyRoute';
import DocumentTitle from 'react-document-title';

const base = (path = '') => `/chat${path}`;

const Routes = {
  chat: LazyRoute(() => import('../../components/Chat')),
};

const Patients = () =>
  <DocumentTitle title="CareCru | Chat">
    <Switch>
      <Route exact path={base()} component={Routes.chat} />
      <Route path={base('/:chatId')} component={Routes.chat} />
    </Switch>
  </DocumentTitle>;

export default Patients;

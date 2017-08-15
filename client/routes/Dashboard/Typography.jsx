
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import TypographyComponent from '../../components/Typography';

const Typography = () =>
  <DocumentTitle title="CareCru | Typography">
    <Route path="/typography" component={TypographyComponent} />
  </DocumentTitle>

export default Typography;

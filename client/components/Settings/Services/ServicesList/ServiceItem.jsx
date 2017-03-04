import React, {Proptypes, Component} from 'react';
import { Row } from '../../../library';

export default function ServiceItem(props) {
  const { service } = props;

  return(
    <Row >
      {service.get('name')}
    </Row>
  );
}
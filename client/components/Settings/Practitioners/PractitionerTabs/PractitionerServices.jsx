import React, {Component, PropTypes} from 'react';

export default function PractitionerServices(props) {
  const { service } = props;
  return (
    <div>
      {service.name}
    </div>
  );
}
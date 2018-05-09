
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import styles from './styles.scss';

export default function SearchPatientTable(props) {
  const searchTheme = {
    input: styles.input,
    group: styles.group,
    icon: styles.icon,
    bar: styles.bar,
  };

  return <Field name="0" theme={searchTheme} icon="search" data-test-id={props['data-test-id']} />;
}

SearchPatientTable.propTypes = {};

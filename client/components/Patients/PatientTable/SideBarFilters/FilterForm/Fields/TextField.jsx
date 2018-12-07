
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '../../../../../library';
import { input, group, icon, bar } from '../../styles.scss';

const TextField = ({ name, theme, ...props }) => (
  <Field
    {...props}
    name={name}
    theme={{
      input,
      group,
      icon,
      bar,
      ...theme,
    }}
    icon="search"
    data-test-id={props['data-test-id']}
  />
);

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  theme: PropTypes.objectOf(PropTypes.string),
  'data-test-id': PropTypes.string,
};

TextField.defaultProps = {
  theme: {},
  'data-test-id': '',
};

export default TextField;

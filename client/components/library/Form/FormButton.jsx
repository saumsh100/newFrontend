
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import Button from '../Button';

export default function FormButton(props) {
  const { pristine } = props;

  const buttonProps = omit(props, ['pristine']);
  return <Button type="submit" disabled={pristine} {...buttonProps} />;
}

FormButton.propTypes = {
  pristine: PropTypes.bool,
};

FormButton.defaultProps = {
  title: 'Save',
};

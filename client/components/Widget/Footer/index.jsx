
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Footer(props) {
  const footerProps = omit(props, ['className']);
  const classes = classNames(props.className, styles.footer);
  return <div className={classes} {...footerProps} />;
}

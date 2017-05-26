import { omit } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './breadcrumbs.scss';
import BreadcrumbItem from './BreadcrumbItem';

const renderItems = items => items.map((props, i) =>
  <BreadcrumbItem key={props.key || i} {...props} />);

const Breadcrumbs = props =>
  <props.as
    {...omit(props, Object.keys(Breadcrumbs.propTypes))}
    className={styles.base}
  >
    {props.children ? props.children : renderItems(props.items)}
  </props.as>;

Breadcrumbs.defaultProps = {
  as: 'ul',
};

Breadcrumbs.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  items: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
};

export default Breadcrumbs;


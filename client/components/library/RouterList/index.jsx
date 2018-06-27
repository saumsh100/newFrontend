
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import jwt from 'jwt-decode';
import Link from '../Link';
import { List, ListItem } from '../List';
import styles from './styles.scss';

export default function RouterList({
  location, routes, className, users,
}) {
  const token = localStorage.getItem('token');
  const decodedToken = jwt(token);

  let role = null;
  users.map((user) => {
    if (decodedToken.userId === user.id) {
      role = user.role;
    }
    return null;
  });

  const listItems = routes.map(({
    to, label, disabled, adminOnly,
  }) => {
    if (adminOnly && role !== 'SUPERADMIN') {
      return null;
    }

    const selectedItem = location.pathname === to;

    return (
      <Link to={to} key={to + label} disabled={disabled}>
        <ListItem
          disabled={disabled}
          selectItem={selectedItem}
          className={className}
          selectedClass={styles.selectedRouterListItem}
        >
          {label}
        </ListItem>
      </Link>
    );
  });

  return <List>{listItems}</List>;
}

RouterList.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    to: PropTypes.string,
  })),
  location: PropTypes.objectOf(PropTypes.string),
  className: PropTypes.string,
  users: PropTypes.instanceOf(Map),
};

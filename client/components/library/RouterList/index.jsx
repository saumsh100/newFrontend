import PropTypes from 'prop-types';
import React from 'react';
import { Map } from 'immutable';
import { useSelector } from 'react-redux';
import Link from '../Link';
import { List, ListItem } from '../List';
import styles from './styles.scss';

export default function RouterList({ location, routes, className, users, featureFlags }) {
  const userId = useSelector((state) => state.auth.get('userId'));

  let role = null;
  users.map((user) => {
    if (userId === user.id) {
      role = user.role;
    }
    return null;
  });

  const listItems = routes.map(({ to, label, disabled, adminOnly, featureFlag }) => {
    if ((adminOnly && role !== 'SUPERADMIN') || (featureFlag && !featureFlags[featureFlag])) {
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
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
  location: PropTypes.objectOf(PropTypes.string).isRequired,
  className: PropTypes.string,
  users: PropTypes.instanceOf(Map),
  featureFlags: PropTypes.shape({}).isRequired,
};

RouterList.defaultProps = {
  className: '',
  users: [],
  routes: [],
};

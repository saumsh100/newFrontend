
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import Link from '../Link';
import { List, ListItem } from '../List';




export default function RouterList({ location, routes, className }) {
  const listItems = routes.map(({ to, label, disabled }) => {
    // TODO: check if active
    return (
      <Link to={to} key={to + label} disabled={disabled}>
        <ListItem disabled={disabled} className={className} >
          {label}
        </ListItem>
      </Link>
    );
  });

  return (
    <List>
      {listItems}
    </List>
  );
}

RouterList.propTypes = {
  routes: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
};

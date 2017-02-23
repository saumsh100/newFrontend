
import React, { PropTypes } from 'react';
import Link from '../Link';
import { List, ListItem } from '../List';

export default function RouterList({ location, routes }) {
  const listItems = routes.map(({ to, label }) => {
    // TODO: check if active
    return (
      <Link to={to} key={to + label}>
        <ListItem>
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

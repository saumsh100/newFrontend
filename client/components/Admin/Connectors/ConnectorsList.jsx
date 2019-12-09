
import PropTypes from 'prop-types';
import React from 'react';
import { sortAsc } from '@carecru/isomorphic';
import ConnectorListItem from './ConnectorListItem';
import { List } from '../../library';
import accountShape from '../../library/PropTypeShapes/accountShape';
import styles from './list.scss';

export default function ConnectorsList({ accounts }) {
  return (
    <List className={styles.list}>
      {accounts
        .get('models')
        .sort((a, b) => sortAsc(a.name.toLowerCase(), b.name.toLowerCase()))
        .toArray()
        .map(account => (
          <ConnectorListItem key={account.id} account={account} />
        ))}
    </List>
  );
}

ConnectorsList.propTypes = { accounts: PropTypes.shape(accountShape).isRequired };

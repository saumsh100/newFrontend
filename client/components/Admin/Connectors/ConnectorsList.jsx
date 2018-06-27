
import React, { PropTypes } from 'react';
import ConnectorListItem from './ConnectorListItem';
import { List } from '../../library';
import styles from './list.scss';

export default function ConnectorsList(props) {
  const accounts = props.accounts.get('models').toArray();
  return (
    <List className={styles.list}>
      {accounts.map(account => <ConnectorListItem key={account.id} account={account} />)}
    </List>
  );
}

ConnectorsList.propTypes = {
  accounts: PropTypes.object,
};

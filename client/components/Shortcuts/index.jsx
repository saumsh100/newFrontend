
import React from 'react';
import { getApiUrl } from '../../util/hub';
import { List, ListItem } from '../library/List';
import SingleShortcut from './SingleShortcut';
import styles from './styles.scss';

export default function Shortcuts() {
  const SHORTCUTS_LIST = [
    {
      label: 'Schedule',
      link: `${getApiUrl()}/schedule`,
    },
    {
      label: 'Reputation Management',
      link: `${getApiUrl()}/reputation`,
    },
    {
      label: 'Settings',
      link: `${getApiUrl()}/settings`,
    },
  ];

  return (
    <List className={styles.container}>
      {SHORTCUTS_LIST.map((shortcut, index) => (
        <ListItem key={index} className={styles.listElement}>
          <SingleShortcut {...shortcut} />
        </ListItem>
      ))}
    </List>
  );
}

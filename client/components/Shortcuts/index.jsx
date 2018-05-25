
import React from 'react';
import { List, ListItem } from '../library/List';
import SingleShortcut from './SingleShortcut';
import styles from './styles.scss';

export default function Shortcuts() {
  const SHORTCUTS_LIST = [
    {
      label: 'Schedule',
      link: 'https://carecru.io/schedule',
    },
    {
      label: 'Reputation Management',
      link: 'https://carecru.io/reputation',
    },
    {
      label: 'Settings',
      link: 'https://carecru.io/settings',
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

import React, {Proptypes, Component} from 'react';
import { ListItem } from '../../../library';
import styles from './styles.scss';

export default function CareCruUser(props) {
  const { careCruUser } = props;

  return(
     <ListItem className={styles.userRow}>
       {careCruUser.getUsername()}
     </ListItem>
  );
}

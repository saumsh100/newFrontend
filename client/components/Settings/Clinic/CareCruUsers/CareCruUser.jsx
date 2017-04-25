import React, {Proptypes, Component} from 'react';
import { Row } from '../../../library';
import styles from './styles.scss';

export default function CareCruUser(props) {
  const { careCruUser } = props;
  return(
     <Row className={styles.userRow}>
       {careCruUser.getUsername()}
     </Row>
  );
}

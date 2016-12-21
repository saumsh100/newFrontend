
import React, { PropTypes } from 'react';
import { Card, CardHeader, CardBlock } from 'reactstrap';
import RouterButton from '../components/library/RouterButton';
import styles from '../components/Patients/styles.scss';

function PatientsContainer(props) {
  const {
    children,
    location,
  } = props;
  
  let header;
  if (location.pathname === '/patients') {
    header = (
      <div>Patients</div>
    );
  } else {
    header = (
      <RouterButton to="/patients" color="link">
        {'< Back to Patient List'}
      </RouterButton>
    );
  }
  
  return (
    <div className={styles.scheduleContainer}>
      <Card className={styles.cardContainer}>
        <CardHeader>{header}</CardHeader>
        <CardBlock>
          {children}
        </CardBlock>
      </Card>
    </div>
  );
}

PatientsContainer.propTypes = {
  
};

export default PatientsContainer;

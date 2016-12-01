
import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardBlock, Table } from 'reactstrap';
import styles from './styles.scss';

class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = { patients: [] };
  }
  
  componentDidMount() {
    window.socket.on('receivePatients', (results) => {
      console.log('patients', results);
      this.setState({ patients: results });
    });
    
    window.socket.emit('fetchPatients');
  }
  
  render() {
    const { patients } = this.state;
    
    return (
      <div className={styles.scheduleContainer}>
        <Card className={styles.cardContainer}>
          <CardHeader>Patients</CardHeader>
          <CardBlock>
            <Table>
              <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
              </tr>
              </thead>
              <tbody>
              {patients.map((patient) => {
                return (
                  <tr>
                    <td>{patient.firstName}</td>
                    <td>{patient.lastName}</td>
                    <td>{patient.phoneNumber}</td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
          </CardBlock>
        </Card>
      </div>
    );
  }
}

export default Patients;


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '../../../library';
import styles from './styles.scss';
import AppointmentsTab from './AppointmentsTab/index';
import PersonalTab from './PersonalTab';

class DataDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    this.setState({
      tabIndex: index,
    });
  }

  render() {
    const {
      patient,
    } = this.props;

    return (
      <div className={styles.mainContainer}>
        <Tabs className={styles.tab} index={this.state.tabIndex} onChange={this.handleTabChange} noUnderLine >
          <Tab label="APPOINTMENTS" >
            <AppointmentsTab patient={patient} />
          </Tab>
          <Tab label="PERSONAL">
            <PersonalTab patient={patient} />
          </Tab>
          <Tab label="INSURANCE" />
          <Tab label="FAMILY" />
        </Tabs>
      </div>
    );
  }
}

DataDisplay.propTypes = {
  patient: PropTypes.object.isRequired,
};

export default DataDisplay;

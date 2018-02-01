
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Avatar, Tabs, Tab } from '../../library';
import About from './About';
import Appointments from './Appointments';
import Insurance from './Insurance';
import styles from './styles.scss';

class PatientInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  render() {
    const { patient } = this.props;
    if (!patient) return null;

    return (
      <Tabs
        fluid
        noUnderLine
        index={this.state.tabIndex}
        onChange={i => this.setState({ tabIndex: i })}
      >
        <Tab
          label="About"
          activeClass={styles.activeTab}
          inactiveClass={styles.inactiveTab}
        >
          <About patient={patient} />
        </Tab>
        <Tab
          label="Appointments"
          activeClass={styles.activeTab}
          inactiveClass={styles.inactiveTab}
        >
          <Appointments patient={patient} />
        </Tab>
        <Tab
          label="Insurance"
          activeClass={styles.activeTab}
          inactiveClass={styles.inactiveTab}
        >
          <Insurance patient={patient} />
        </Tab>
      </Tabs>
    );
  }
}

PatientInfo.propTypes = {
  patient: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(PatientInfo);


import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, IconButton, Header } from '../../../library';
import styles from '../styles.scss';
import PractitionerBasicData from './PractitionerBasicData';
import PractitionerOfficeHours from './PractitionerOfficeHours';
import PractitionerServices from './PractitionerServices';
import PractitionerTimeOff from './PractitionerTimeOff';
import { updateEntityRequest, deleteEntityRequest } from '../../../../thunks/fetchEntities';

class PractitionerTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.updatePractitioner = this.updatePractitioner.bind(this);
    this.deletePractitioner = this.deletePractitioner.bind(this);
  }

  componentWillMount() {
    this.setState({ index: 0 });
  }

  updatePractitioner(modifiedPractitioner, alert) {
    this.props.updateEntityRequest({ key: 'practitioners', model: modifiedPractitioner, alert });
  }

  deletePractitioner() {
    const { practitioner } = this.props;

    let deletePrac = confirm('Delete Practitioner?');

    if (deletePrac) {
      this.props.deleteEntityRequest({ key: 'practitioners', id: practitioner.get('id') });
      this.props.setPractitionerId({ id: null });
    }
  }

  handleTabChange(index) {
    this.setState({ index });
  }

  render() {
    const { practitioner, weeklySchedule, timeOffs } = this.props;

    if (!practitioner && !weeklySchedule) {
      return null;
    }

    let serviceIds = null;
    serviceIds = practitioner.get('services');

    return (
      <div>
        <div className={styles.pracHeaderContainer}>
          <Header title={practitioner.getFullName()} />
          <div className={styles.trashButton}>
            <IconButton icon="trash" onClick={this.deletePractitioner} data-test-id="deletePractitioner" />
          </div>
        </div>
        <Tabs index={this.state.index} onChange={this.handleTabChange} >
          <Tab label="Basic" data-test-id="practitionerBasicDataTab">
            <PractitionerBasicData
              key={practitioner.get('id')}
              practitioner={practitioner}
              updatePractitioner={this.updatePractitioner}
            />
          </Tab>
          <Tab label="Practitioner Schedule" data-test-id="practitionerOfficeHoursTab">
            <PractitionerOfficeHours
              key={practitioner.get('id')}
              weeklySchedule={weeklySchedule}
              practitioner={practitioner}
              updateEntityRequest={this.props.updateEntityRequest}
            />
          </Tab>
          <Tab label="Services" data-test-id="practitionerServicesTab">
            <PractitionerServices
              key={practitioner.get('id')}
              serviceIds={serviceIds}
              practitioner={practitioner}
              updatePractitioner={this.updatePractitioner}
            />
          </Tab>
          <Tab label="Time Off" data-test-id="practitionerTimeOffTab">
            <PractitionerTimeOff
              key={practitioner.get('id')}
              practitioner={practitioner}x
              timeOffs={timeOffs}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);


export default enhance(PractitionerTabs);

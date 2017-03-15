import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Card, Tab } from '../../../library';
import styles from '../styles.scss';
import PractitionerBasicData from './PractitionerBasicData';
import PractitionerOfficeHours from './PractitionerOfficeHours';
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

  updatePractitioner(modifiedPractitioner) {
    this.props.updateEntityRequest({ key: 'practitioners', model: modifiedPractitioner });
  }

  deletePractitioner(id) {
    this.props.deleteEntityRequest({ key: 'practitioners', id });
    this.props.setPractitionerId({ id: null });
  }

  handleTabChange(index) {
    this.setState({ index });
  }

  render() {
    const { practitioner, weeklySchedule } = this.props;

    if (!practitioner && !weeklySchedule) {
      return null;
    }

    return (
      <Tabs index={this.state.index} onChange={this.handleTabChange}>
        <Tab label="Basic">
          <PractitionerBasicData
            key={practitioner.get('id')}
            practitioner={practitioner}
            updatePractitioner={this.updatePractitioner}
            deletePractitioner={this.deletePractitioner}
          />
        </Tab>
        <Tab label="Office Hours">
          <PractitionerOfficeHours
            key={practitioner.get('id')}
            weeklySchedule={weeklySchedule}
            practitioner={practitioner}
            updateEntityRequest={this.props.updateEntityRequest}
          />
        </Tab>
      </Tabs>
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
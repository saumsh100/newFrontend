import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Card, Tab, Button, Header, Grid, Row, Col } from '../../../library';
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
    const { practitioner, weeklySchedule } = this.props;

    if (!practitioner && !weeklySchedule) {
      return null;
    }

    return (
      <Row className={styles.practDataContainer}>
        <Col xs={12} className={styles.pracHeaderContainer}>
          <Header title={practitioner.getFullName()} />
          <div className={styles.trashButton}>
            <Button icon="trash" raised onClick={this.deletePractitioner}>
              Delete
            </Button>
          </div>
        </Col>
        <Col xs={12}>
          <Tabs index={this.state.index} onChange={this.handleTabChange} >
            <Tab label="Basic">
              <PractitionerBasicData
                key={practitioner.get('id')}
                practitioner={practitioner}
                updatePractitioner={this.updatePractitioner}
              />
            </Tab>
            <Tab label="Practitioner Schedule">
              <PractitionerOfficeHours
                key={practitioner.get('id')}
                weeklySchedule={weeklySchedule}
                practitioner={practitioner}
                updateEntityRequest={this.props.updateEntityRequest}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
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
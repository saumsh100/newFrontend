
import React, { Component } from 'react';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import InfoDump from '../../Patients/Shared/InfoDump';
import { formatPhoneNumber } from '../../library/util/Formatters';
import { Form, Field } from '../../library';
import styles from './styles.scss';

const Marker = ({ text }) => <div className={styles.marker}>{text}</div>;

const AppBookedForm = ({ initialValues, id, handleToggle }) => (
  <Form
    form={`appBookedForm_${id}`}
    onChange={handleToggle}
    initialValues={initialValues}
    ignoreSaveButton
  >
    <Field name="wasApptBooked" component="Toggle" />
  </Form>
);

class CallInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lng: null,
      loaded: false,
    };
    this.renderLeftPanel = this.renderLeftPanel.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    const { call } = this.props;
    const address = `${call.callerCity} ${call.callerState}`;
    const apiKey = `&key=${process.env.GOOGLE_API_KEY}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${apiKey}`;

    fetch(url)
      .then(result => result.json())
      .then(
        (data) => {
          const geoData = data.results[0];
          this.setState({ loaded: true, ...geoData.geometry.location });
        },
        (error) => {
          console.error(error);
          this.setState({
            loaded: false,
          });
        }
      );
  }

  handleToggle(values) {
    const { call } = this.props;

    return this.props.handleCallUpdate(call.id, values.wasApptBooked);
  }

  renderLeftPanel() {
    const { call } = this.props;

    const callerId =
      call.callerCity && call.callerState ? `${call.callerCity}, ${call.callerState}` : null;

    return (
      <div className={styles.leftPanel}>
        <div className={styles.title}>Caller Info</div>
        <div className={styles.row}>
          <InfoDump label="Name" data={call.callerName} />
          <InfoDump label="Initial Source" data={call.callSource} />
        </div>
        <div className={styles.row}>
          <InfoDump label="Received" data={moment(call.startTime).format('MMM DD, YYYY h:mm A')} />
          <InfoDump label="Phone number" data={formatPhoneNumber(call.callerNum)} />
        </div>
        <div className={styles.row}>
          <InfoDump label="Total calls" data={call.totalCalls} />
          <InfoDump label="Caller ID" data={callerId} />
        </div>
        {this.state.loaded && (
          <div className={styles.map}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.GOOGLE_API_KEY }}
              defaultCenter={{
                lat: this.state.lat,
                lng: this.state.lng,
              }}
              defaultZoom={6}
            />
          </div>
        )}
      </div>
    );
  }

  renderRightPanel() {
    const { call } = this.props;

    const initialValues = {
      wasApptBooked: call.wasApptBooked,
    };

    return (
      <div className={styles.rightPanel}>
        <div className={styles.title}>Recording</div>
        {call.recording ? (
          <div className={styles.playerWrapper}>
            <audio controls controlsList="nodownload">
              <source src={call.recording} type="audio/ogg" />
            </audio>
          </div>
        ) : (
          <div className={styles.noData}> N/A </div>
        )}

        <div className={styles.title}>Edit Call Attributes</div>
        <div className={styles.appBooked}>
          <InfoDump
            label="Appointment Booked"
            component={
              <AppBookedForm
                initialValues={initialValues}
                id={call.id}
                handleToggle={this.handleToggle}
              />
            }
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.callInfoModal}>
        {this.renderLeftPanel()}
        {this.renderRightPanel()}
      </div>
    );
  }
}

AppBookedForm.propTypes = {
  id: PropTypes.string,
  handleToggle: PropTypes.func,
  initialValues: PropTypes.objectOf(PropTypes.bool),
};

Marker.propTypes = {
  text: PropTypes.string,
};

CallInfo.propTypes = {
  call: PropTypes.objectOf(PropTypes.any),
  handleCallUpdate: PropTypes.func,
};

export default CallInfo;

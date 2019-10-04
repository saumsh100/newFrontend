
import React, { Component } from 'react';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '@carecru/isomorphic';
import InfoDump from '../../Patients/Shared/InfoDump';
import { Form, Field } from '../../library';
import styles from './styles.scss';
import { callShape } from '../../library/PropTypeShapes';

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
          this.setState({
            loaded: true,
            ...geoData.geometry.location,
          });
        },
        (error) => {
          console.error(error);
          this.setState({ loaded: false });
        },
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

    return (
      <div className={styles.rightPanel}>
        <div className={styles.title}>Recording</div>
        {call.recording ? (
          <div className={styles.playerWrapper}>
            <audio controls controlsList="nodownload">
              <source src={call.recording} type="audio/ogg" />
              <track kind="captions" />
            </audio>
          </div>
        ) : (
          <div className={styles.noData}> N/A </div>
        )}
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
  handleToggle: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.bool).isRequired,
};

AppBookedForm.defaultProps = {
  id: null,
};

Marker.propTypes = { text: PropTypes.string };

Marker.defaultProps = {
  text: null,
};

CallInfo.propTypes = {
  call: PropTypes.shape(callShape).isRequired,
  handleCallUpdate: PropTypes.func.isRequired,
};

export default CallInfo;

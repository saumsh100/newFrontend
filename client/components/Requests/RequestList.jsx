
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'query-string';
import { Map } from 'immutable';
import RequestListItem from './RequestListItem';
import RequestPopover from './RequestPopover';
import Requests from '../../entities/models/Request';
import { List, Media, Icon } from '../library';
import { checkIfUsersEqual } from '../Utils';
import { isHub } from '../../util/hub';
import styles from './styles.scss';
import {
  updateEntityRequest,
  deleteEntityRequest,
  createEntityRequest,
} from '../../thunks/fetchEntities';
import { setBackHandler, setTitle } from '../../reducers/electron';
import { setHoverRequestId, setUndoRequest } from '../../actions/requests';
import { selectAppointment } from '../../actions/schedule';
import { checkPatientUser } from '../../thunks/schedule';

class RequestList extends Component {
  constructor(props) {
    super(props);

    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.openRequest = this.openRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
    this.backHandler = this.backHandler.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);

    this.handleTitleChange(props.selectedRequest);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedRequest: nextSelectedRequest } = nextProps;
    const { selectedRequest } = this.props;

    this.handleTitleChange(nextSelectedRequest, selectedRequest);
  }

  handleTitleChange(nextSelected, selected) {
    if (isHub()) {
      if (nextSelected && !selected) {
        this.props.setBackHandler(this.backHandler);
        this.props.setTitle(
          <p>
            <Icon icon="calendar" type="regular" size={0.9} className={styles.calendarIcon} />
            {nextSelected.getFormattedTime()}
          </p>
        );
      }
    }
  }

  confirmAppointment(request, patientUser) {
    const {
      routing: { location },
      redirect,
    } = this.props;

    const modifiedRequest = request.set('isConfirmed', true);
    const requestData = {
      requestId: request.get('id'),
      createdAt: request.get('createdAt'),
      startDate: request.get('startDate'),
      endDate: request.get('endDate'),
      serviceId: request.get('serviceId'),
      note: request.note,
      isSyncedWithPms: false,
      customBufferTime: 0,
      request: true,
      requestModel: modifiedRequest,
      practitionerId: request.get('practitionerId'),
    };

    this.props.checkPatientUser(patientUser, requestData);

    this.props.push({ ...location, ...redirect });
  }

  removeRequest(request) {
    const confirmRemove = confirm('Are you sure you want to reject this request?'); // eslint-disable-line no-alert
    if (confirmRemove) {
      this.openRequest(null);
      this.props.updateEntityRequest({
        url: `/api/requests/${request.id}/reject`,
        values: {},
      });
    }
  }

  backHandler() {
    this.openRequest(null);
  }

  openRequest(id) {
    const {
      routing: { location },
    } = this.props;

    this.props.push({ ...location, search: stringify({ selectedRequest: id || undefined }) });
  }

  renderSelectedRequest(props) {
    const { services, patientUsers, practitioners, selectedRequest } = props;

    const patientUser = patientUsers.get(selectedRequest.get('patientUserId'));
    const fullName = patientUser.get('firstName').concat(' ', patientUser.get('lastName'));
    const service = services.get(selectedRequest.get('serviceId'));
    const serviceName = service ? service.name : '';
    const practitionerId = selectedRequest.get('practitionerId');
    const practitioner = practitionerId ? practitioners.get(practitionerId) : null;
    const requestingUser = patientUsers.get(selectedRequest.get('requestingPatientUserId'));
    const data = {
      time: selectedRequest.getFormattedTime(),
      age: '',
      name: fullName,
      nameAge: '',
      email: patientUser.email,
      service: serviceName,
      phoneNumber: patientUser.phoneNumber,
      note: selectedRequest.note,
      insuranceCarrier: selectedRequest.insuranceCarrier,
      insuranceMemberId: selectedRequest.insuranceMemberId,
      month: selectedRequest.getMonth(),
      day: selectedRequest.getDay(),
    };

    return (
      <RequestPopover
        time={data.time}
        service={data.service}
        note={data.note}
        insuranceCarrier={data.insuranceCarrier}
        insuranceMemberId={data.insuranceMemberId}
        practitioner={practitioner}
        patient={patientUser}
        request={selectedRequest}
        closePopover={this.backHandler}
        acceptRequest={() => this.confirmAppointment(selectedRequest, patientUser)}
        rejectRequest={() => this.removeRequest(selectedRequest)}
        requestingUser={checkIfUsersEqual(patientUser, requestingUser)}
        isMobile
      />
    );
  }

  renderRequestList(props) {
    const { sortedRequests, services, patientUsers, practitioners, popoverRight } = props;
    return (
      <List className={styles.requestList}>
        {sortedRequests.map((request) => {
          const practitionerId = request.get('practitionerId');
          const practitioner = practitionerId ? practitioners.get(practitionerId) : null;

          const requestingUser = patientUsers.get(request.get('requestingPatientUserId'));

          return (
            <RequestListItem
              key={request.id}
              request={request}
              service={services.get(request.get('serviceId'))}
              practitioner={practitioner}
              patientUser={patientUsers.get(request.get('patientUserId'))}
              requestingUser={requestingUser}
              confirmAppointment={this.confirmAppointment}
              removeRequest={this.removeRequest}
              setClickedId={this.props.setHoverRequestId}
              requestId={this.props.requestId}
              openRequest={this.openRequest}
              popoverRight={popoverRight}
            />
          );
        })}
      </List>
    );
  }

  render() {
    return (
      <Media query="(max-width: 700px)">
        {matches =>
          (this.props.selectedRequest && (matches || isHub())
            ? this.renderSelectedRequest(this.props)
            : this.renderRequestList(this.props))
        }
      </Media>
    );
  }
}

const locationShape = {
  pathname: PropTypes.string,
  search: PropTypes.string,
};

RequestList.propTypes = {
  checkPatientUser: PropTypes.func,
  createEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  popoverRight: PropTypes.string,
  practitioners: PropTypes.instanceOf(Map),
  push: PropTypes.func,
  requestId: PropTypes.string,
  routing: PropTypes.shape({
    location: PropTypes.shape(locationShape),
  }),
  redirect: PropTypes.shape(locationShape),
  selectAppointment: PropTypes.func,
  selectedRequest: PropTypes.instanceOf(Requests),
  services: PropTypes.instanceOf(Map).isRequired,
  setHoverRequestId: PropTypes.func,
  setUndoRequest: PropTypes.func,
  sortedRequests: PropTypes.arrayOf(PropTypes.instanceOf(Requests)),
  updateEntityRequest: PropTypes.func,
  setBackHandler: PropTypes.func,
  setTitle: PropTypes.func,
};

const mapStateToProps = ({ routing }) => ({
  routing,
});

const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      updateEntityRequest,
      deleteEntityRequest,
      createEntityRequest,
      setHoverRequestId,
      selectAppointment,
      checkPatientUser,
      push,
      setUndoRequest,
      setBackHandler,
      setTitle,
    },
    dispatch
  );

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(RequestList);

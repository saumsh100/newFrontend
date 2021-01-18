
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { stringify } from 'query-string';
import { Map } from 'immutable';
import RequestListItem from './RequestListItem';
import RequestPopover from './RequestPopover';
import Requests from '../../entities/models/Request';
import { List, Media, Icon, getFormattedTime } from '../library';
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

  componentDidUpdate(prevProps) {
    const { selectedRequest: nextSelectedRequest } = this.props;
    const { selectedRequest } = prevProps;

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
          </p>,
        );
      }
    }
  }

  confirmAppointment(request, patientUser) {
    const { location, redirect } = this.props;

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
      requestingPatientUserId: request.get('requestingPatientUserId'),
    };

    this.props.checkPatientUser(patientUser, requestData);

    this.props.push({
      ...location,
      ...redirect,
    });
  }

  removeRequest(request) {
    const confirmRemove = window.confirm('Are you sure you want to reject this request?');
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
    this.props.push({
      ...this.props.location,
      search: stringify({ selectedRequest: id || undefined }),
    });
  }

  renderSelectedRequest() {
    const { services, patientUsers, practitioners, selectedRequest, timezone } = this.props;

    const patientUser = patientUsers.get(selectedRequest.get('patientUserId'));
    const fullName = patientUser.get('firstName').concat(' ', patientUser.get('lastName'));
    const service = services.get(selectedRequest.get('serviceId'));
    const serviceName = service ? service.name : '';
    const practitionerId = selectedRequest.get('practitionerId');
    const practitioner = practitionerId ? practitioners.get(practitionerId) : null;
    const requestingUser = patientUsers.get(selectedRequest.get('requestingPatientUserId'));

    const startDate = selectedRequest.get('startDate');
    const endDate = selectedRequest.get('endDate');

    const data = {
      time: getFormattedTime(startDate, endDate, timezone),
      age: '',
      name: fullName,
      nameAge: '',
      email: patientUser.email,
      service: serviceName,
      phoneNumber: patientUser.phoneNumber,
      note: selectedRequest.note,
      insuranceCarrier: selectedRequest.insuranceCarrier,
      insuranceMemberId: selectedRequest.insuranceMemberId,
      insuranceGroupId: selectedRequest.insuranceGroupId,
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
        insuranceGroupId={data.insuranceGroupId}
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

  renderRequestList() {
    const { sortedRequests, services, patientUsers, practitioners, popoverRight } = this.props;
    const urlParams = new URLSearchParams(window.location.search);
    const selectedRequest = urlParams.get('selectedRequest');

    return (
      <List
        className={styles.requestList}
        onScroll={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (selectedRequest) {
            this.openRequest(null);
          }
        }}
      >
        {sortedRequests.map((request) => {
          const practitionerId = request.get('practitionerId');
          const practitioner = (practitionerId && practitioners.get(practitionerId)) || null;

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
              timezone={this.props.timezone}
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
            ? this.renderSelectedRequest()
            : this.renderRequestList())
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
  checkPatientUser: PropTypes.func.isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  popoverRight: PropTypes.string,
  practitioners: PropTypes.instanceOf(Map),
  push: PropTypes.func.isRequired,
  requestId: PropTypes.string,
  location: PropTypes.shape(locationShape).isRequired,
  redirect: PropTypes.shape(locationShape).isRequired,
  selectedRequest: PropTypes.instanceOf(Requests),
  services: PropTypes.instanceOf(Map).isRequired,
  setHoverRequestId: PropTypes.func.isRequired,
  sortedRequests: PropTypes.arrayOf(PropTypes.instanceOf(Requests)),
  updateEntityRequest: PropTypes.func.isRequired,
  setBackHandler: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

RequestList.defaultProps = {
  popoverRight: '',
  practitioners: Map({}),
  requestId: '',
  selectedRequest: null,
  sortedRequests: [],
};

const mapStateToProps = ({ auth, router: { location } }) => ({
  location,
  timezone: auth.get('timezone'),
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
    dispatch,
  );

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(RequestList);

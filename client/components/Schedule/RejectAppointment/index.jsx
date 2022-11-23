import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { change } from 'redux-form';
import { push } from 'connected-react-router';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import RequestsModel from '../../../entities/models/Request';
import { showAlertTimeout } from '../../../thunks/alerts';
import {
  StandardButton as Button,
  Card,
  SContainer,
  SFooter,
  SHeader,
  SBody,
  Icon,
  getUTCDate,
  getFormattedDate,
  DropdownSelect,
  TextArea,
  Row,
  Col,
} from '../../library';
import styles from './styles.scss';

function RejectAppointment(props) {
  const title = 'Reject Online Request';
  const buttonTitle = 'Reject';
  const { patientUsers, timezone, services, practitioners, rejectAppointment, reinitializeState } =
    props;

  const [reason, setReason] = useState(null);
  const [notes, setNotes] = useState(null);

  const appointmentDate = getFormattedDate(rejectAppointment?.startDate, 'dddd LL', timezone);
  const getTime = (value) => getUTCDate(value, timezone).format('LT');
  const time = `${getTime(rejectAppointment?.startDate)} - ${getTime(rejectAppointment?.endDate)}`;
  const serviceId = rejectAppointment?.serviceId;
  const service = services.get(serviceId);
  const practitioner = practitioners.get(rejectAppointment?.practitionerId);
  const patientUser = patientUsers.get(rejectAppointment.get('patientUserId'));
  const patientUserName = `${patientUser?.firstName} ${patientUser?.lastName}`;

  const handleClick = () => {
    reinitializeState();
  };

  const onSubmit = () => {
    props
      .updateEntityRequest({
        url: `/api/requests/${rejectAppointment?.id}/reject`,
        values: {
          rejectionReason: notes ? `${reason} - ${notes}` : reason,
        },
      })
      .then(() => {
        return reinitializeState();
      });
    props.showAlertTimeout({
      type: 'error',
      alert: {
        title: 'Appointment Request Rejected',
        body: (
          <p>
            You have rejected the Online Request from <b>{patientUserName}</b>
          </p>
        ),
      },
    });
  };

  const disabled = reason === 'Other' ? notes : reason;

  return (
    <Card className={styles.formContainer} noBorder>
      <SContainer>
        <SHeader className={styles.header}>
          <Icon type="light" icon="exclamation-circle" className={styles.circle} />
          <div className={styles.title}>{title}</div>
          <Button className={styles.close} onClick={handleClick}>
            <Icon icon="times" />
          </Button>
        </SHeader>
        <SBody className={styles.body}>
          <div className={styles.message}>
            Are you sure want to reject this online request from <b>{patientUserName}?</b>
          </div>
          <div className={styles.patientData}>
            <div>
              <span className={styles.headingData}>Date:</span>
              <span className={styles.data}> {appointmentDate}</span>
            </div>
            <div>
              <span className={styles.headingData}>Time:</span>
              <span className={styles.data}> {time}</span>
            </div>
            <div>
              <span className={styles.headingData}>Appointment Type:</span>
              <span className={styles.data}> {service.name}</span>
            </div>
            <div>
              <span className={styles.headingData}>practitioner:</span>
              <span className={styles.data}> {practitioner ? practitioner.getPrettyName() : 'No Preference'}</span>
            </div>
          </div>

          <Row middle="md">
            <Col md={6}>
              <div className={styles.dropdownheading}>Please select a reason:</div>
              <DropdownSelect
                value={reason === null ? <span className={styles.select}>-Select-</span> : reason}
                label={reason === null ? '-Select-' : ''}
                required
                options={[
                  { label: 'Patient Unreachable', value: 'Patient Unreachable' },
                  { label: 'Patient Reconsidered', value: 'Patient Reconsidered' },
                  { label: 'Duplicate Request', value: 'Duplicate Request' },
                  { label: 'Time Unavailable', value: 'Time Unavailable' },
                  { label: 'Other', value: 'Other' },
                ]}
                onChange={(graph) => {
                  setReason(graph);
                }}
                theme={{
                  toggleDiv: styles.toggleDiv,
                  caretIconWrapper: styles.caretIconWrapper,
                  toggleValueDiv: styles.toggleValueDiv,
                  label: styles.label,
                  optionListItem: styles.optionListItem,
                  dropDownList: styles.dropDownList,
                }}
              />
            </Col>
          </Row>

          {reason === 'Other' ? (
            <div className={styles.textContent}>
              <TextArea
                placeholder="e.g,Patient Could have made a mistake..."
                theme={{
                  group: styles.group,
                  filled: styles.filled,
                  bar: styles.bar,
                  labelWrapper: styles.labelWrapper,
                }}
                classStyles={styles.textArea}
                value={notes || ''}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
              />
              <Icon icon="asterisk" className={styles.asteriskIcon} type="solid" />
            </div>
          ) : (
            ''
          )}
        </SBody>
        <SFooter className={styles.footer}>
          <div className={styles.button_cancel}>
            <Button onClick={handleClick} variant="secondary">
              Close
            </Button>
          </div>
          <Button
            variant="destructive"
            disabled={!!(disabled === null || disabled === '')}
            disableVariant="destructiveDisable"
            onClick={onSubmit}
          >
            {buttonTitle}
          </Button>
        </SFooter>
      </SContainer>
    </Card>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateEntityRequest,
      showAlertTimeout,
      changeForm: change,
      setLocation: push,
    },
    dispatch,
  );

const mapStateToProps = ({ entities, auth, schedule }) => {
  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const services = entities.getIn(['services', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);

  return {
    patientUsers,
    timezone: auth.get('timezone'),
    services,
    practitioners,
    rejectAppointment: schedule.get('rejectedAppointment'),
  };
};

RejectAppointment.propTypes = {
  practitioners: PropTypes.instanceOf(Map).isRequired,
  reinitializeState: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  patientUsers: PropTypes.instanceOf(Map),
  services: PropTypes.instanceOf(Map),
  rejectAppointment: PropTypes.instanceOf(RequestsModel),
};

RejectAppointment.defaultProps = {
  patientUsers: Map,
  services: Map,
};

export default connect(mapStateToProps, mapDispatchToProps)(RejectAppointment);

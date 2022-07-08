import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Popover from 'react-popover';
import PropTypes from 'prop-types';
import RequestPopover from '../../Requests/RequestPopover';
import styles from '../PatientPopover/reskin-styles.scss';
import { getUTCDate } from '../util/datetime';

class RequestPopoverLoader extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.setOpen = this.setOpen.bind(this);
    this.closeOnScroll = this.closeOnScroll.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollId) {
      document.getElementById(this.props.scrollId).addEventListener('scroll', this.closeOnScroll);
      window.addEventListener('scroll', this.closeOnScroll);
    }
  }

  setOpen(value) {
    this.setState({ isOpen: value });
  }

  closeOnScroll() {
    this.setState({ isOpen: false });
  }

  render() {
    const {
      placement,
      children,
      closePopover,
      patientStyles,
      isNoteFormActive,
      isFollowUpsFormActive,
      isRecallsFormActive,
      practitioners,
      data,
      timezone,
    } = this.props;

    if (!data) {
      return null;
    }
    const isAnyFormActive = isNoteFormActive || isFollowUpsFormActive || isRecallsFormActive;
    const getTime = (value) => getUTCDate(value, timezone).format('LT');
    const time = `${getTime(data.startDate)} - ${getTime(data.endDate)}`;
    const practitionerEntity = data.practitioner && practitioners.get(data.practitioner.id);

    return (
      <Popover
        {...this.props}
        isOpen={this.state.isOpen && !closePopover}
        body={[
          <RequestPopover
            time={time}
            service={data.service.name}
            note={data.note}
            insuranceCarrier={data.insuranceCarrier}
            insuranceMemberId={data.insuranceMemberId}
            insuranceGroupId={data.insuranceGroupId}
            patient={data.patientUser}
            practitioner={practitionerEntity}
            request={data}
            closePopover={() => this.setOpen(false)}
            requestingUser={data.requestingUser}
            showButton={false}
          />,
        ]}
        preferPlace={placement || 'right'}
        tipSize={12}
        onOuterAction={() => !isAnyFormActive && this.setOpen(false)}
      >
        <div className={classnames(styles.requestLink, patientStyles)}>
          {React.Children.map(children, (patientLink) =>
            React.cloneElement(patientLink, {
              onClick: (e) => {
                e.stopPropagation();
                this.setOpen(true);
              },
            }),)}
        </div>
      </Popover>
    );
  }
}

RequestPopoverLoader.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  placement: PropTypes.string,
  closePopover: PropTypes.bool,
  push: PropTypes.func,
  scrollId: PropTypes.string,
  patientStyles: PropTypes.string,
  getOrCreateChatForPatient: PropTypes.func,
  patientChat: PropTypes.string,
  timezone: PropTypes.string.isRequired,
  isNoteFormActive: PropTypes.bool.isRequired,
  isFollowUpsFormActive: PropTypes.bool.isRequired,
  isRecallsFormActive: PropTypes.bool.isRequired,
  practitioners: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any),
};

RequestPopoverLoader.defaultProps = {
  closePopover: false,
  scrollId: '',
  placement: 'right',
  className: styles.patientPopover,
  patientStyles: '',
  patientChat: null,
  data: null,
  push: null,
  getOrCreateChatForPatient: null,
};

const mapStateToProps = ({ patientTable, entities, auth }) => ({
  practitioners: entities.getIn(['practitioners', 'models']),
  isNoteFormActive: patientTable.get('isNoteFormActive'),
  isFollowUpsFormActive: patientTable.get('isFollowUpsFormActive'),
  isRecallsFormActive: patientTable.get('isRecallsFormActive'),
  timezone: auth.get('timezone'),
});

export default connect(mapStateToProps)(RequestPopoverLoader);

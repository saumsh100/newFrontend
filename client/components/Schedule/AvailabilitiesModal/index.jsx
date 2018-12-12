
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { sortAsc, dateFormatter } from '@carecru/isomorphic';
import {
  Button,
  Card,
  Icon,
  SBody,
  SContainer,
  SFooter,
  SHeader,
  DropdownSelect,
  Modal,
} from '../../library';
import { fetchAvailabilities } from '../../../thunks/schedule';
import appoitmentsStyle from '../AddNewAppointment/styles.scss';
import styles from './styles.scss';

class AvailabilitiesModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedReason: (props.reasons[0] && props.reasons[0].value) || '' };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { showAvailabilities } = this.props;
    if (prevProps.showAvailabilities !== showAvailabilities && showAvailabilities === true) {
      this.props.fetchAvailabilities(this.props.scheduleDate, this.state.selectedReason);
    }
  }

  handleChange(value) {
    this.setState({ selectedReason: value }, () =>
      this.props.fetchAvailabilities(this.props.scheduleDate, this.state.selectedReason));
  }

  render() {
    const {
      timezone,
      showAvailabilities,
      reinitializeState,
      availabilities,
      practitioners,
    } = this.props;

    return (
      <Modal
        custom
        active={showAvailabilities}
        onEscKeyDown={reinitializeState}
        onOverlayClick={reinitializeState}
      >
        <Card className={appoitmentsStyle.formContainer} noBorder>
          <SContainer>
            <SHeader className={appoitmentsStyle.header}>
              <div>Availabilities</div>
              <Button className={appoitmentsStyle.close} onClick={reinitializeState}>
                <Icon icon="times" />
              </Button>
            </SHeader>
            <SBody className={styles.body}>
              {this.props.error && (
                <div>
                  {JSON.stringify(this.props.error, null, 2)}
                  <h3>You still have some configuration to do.</h3>
                  <p>It looks like you did not assign a reason to any practitioner.</p>
                </div>
              )}
              {!this.props.error && (
                <DropdownSelect
                  label="Reason:"
                  value={this.state.selectedReason}
                  onChange={this.handleChange}
                  options={this.props.reasons}
                />
              )}
              {Object.entries(availabilities)
                .sort(([a], [b]) => sortAsc(a, b))
                .map(([key, value]) => {
                  const practitioner = practitioners.get(key);

                  return (
                    practitioner && (
                      <p key={practitioner.id} className={styles.practitionerBlock}>
                        <h2>{`${practitioner.get('type')} | ${practitioner.getPrettyName()}`}</h2>
                        {value.map(v => (
                          <span className={styles.pill} key={`${practitioner.id}${v.startDate}`}>
                            {`${dateFormatter(v.startDate, timezone, 'h:mma')} | ${dateFormatter(
                              v.endDate,
                              timezone,
                              'h:mma',
                            )}`}
                          </span>
                        ))}
                      </p>
                    )
                  );
                })}
            </SBody>
            <SFooter className={appoitmentsStyle.footer}>
              <div className={appoitmentsStyle.button_cancel}>
                <Button onClick={reinitializeState} border="blue">
                  Cancel
                </Button>
              </div>
            </SFooter>
          </SContainer>
        </Card>
      </Modal>
    );
  }
}

AvailabilitiesModal.propTypes = {
  showAvailabilities: PropTypes.bool.isRequired,
  reinitializeState: PropTypes.func.isRequired,
  fetchAvailabilities: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  scheduleDate: PropTypes.string.isRequired,
  availabilities: PropTypes.instanceOf(Map).isRequired,
  error: PropTypes.instanceOf(Map).isRequired,
  reasons: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
};

const mapStateToProps = ({ schedule, entities, auth }) => ({
  timezone: auth.get('timezone'),
  scheduleDate: schedule.get('scheduleDate').toISOString(),
  availabilities: schedule.get('availabilities').toJS(),
  error: schedule.get('error'),
  reasons: Object.values(entities.getIn(['services', 'models']).toJS()).map(v => ({
    value: v.id,
    label: v.name,
  })),
  practitioners: entities.getIn(['practitioners', 'models']),
});

const mapActionsToProps = dispatch => bindActionCreators({ fetchAvailabilities }, dispatch);

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(AvailabilitiesModal);

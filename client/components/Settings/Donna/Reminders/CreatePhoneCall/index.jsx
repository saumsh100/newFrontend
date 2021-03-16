
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { normalizePhone } from '../../../../../util/isomorphic';
import { Button, Col, DialogBox, DropdownSelect, Grid, Row } from '../../../../library';
import RadioGroup from '../../../../library/ui-kit/Radio/RadioGroup';
import Radio from '../../../../library/ui-kit/Radio';
import Input from '../../../../library/Input';
import Account from '../../../../../entities/models/Account';
import styles from './styles.scss';

const initialState = ({ touchpoint = '' } = {}) => ({
  touchpoint,
  status: 'confirmed',
  phoneNumber: '',
});

class CreatePhoneCall extends Component {
  constructor(props) {
    super(props);

    this.state = initialState({ touchpoint: props.selectedTouchpoint });
    this.cleanFormAndCloseModal = this.cleanFormAndCloseModal.bind(this);
    this.handleTestCall = this.handleTestCall.bind(this);
  }

  cleanFormAndCloseModal() {
    this.setState(initialState());
    this.props.toggleAction();
  }

  handleTestCall() {
    const [amount, unit] = this.state.touchpoint.split(' ');
    const params = {
      accountId: this.props.account.get('id'),
      status: this.state.status,
      cellPhoneNumber: this.state.phoneNumber.replace(/ /g, ''),
      timezone: this.props.account.timezone,
      amount,
      unit,
      callback: () => this.setState(this.cleanFormAndCloseModal),
    };
    this.props.sendReminderPreviewCall(params);
  }

  render() {
    const mappedOptions = this.props.reminders.map(r => ({
      value: r,
      label: r,
    }));

    return (
      <DialogBox
        active={this.props.active}
        onEscKeyDown={this.cleanFormAndCloseModal}
        onOverlayClick={this.cleanFormAndCloseModal}
        actions={[
          {
            label: 'Call Now',
            onClick: this.handleTestCall,
            component: Button,
            props: {
              border: 'blue',
              disabled: !this.state.phoneNumber || !this.state.touchpoint,
            },
          },
        ]}
        title="Send a Test"
        type="medium"
      >
        <div>
          <p>To listen to the phone call as if you were a patient, fill in the form below</p>
          <Grid>
            <Row>
              <Col xs={9}>
                <DropdownSelect
                  label="Reminder Touchpoint"
                  value={this.state.touchpoint}
                  onChange={touchpoint => this.setState({ touchpoint })}
                  options={mappedOptions}
                />
              </Col>
              <Col xs={3}>
                <div className={styles.statusWrapper}>
                  <RadioGroup
                    value={this.state.status}
                    onChange={status => this.setState({ status })}
                  >
                    <Radio label="Confirmed" value="confirmed" />
                    <Radio label="Unconfirmed" value="unconfirmed" />
                  </RadioGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Input
                  value={this.state.phoneNumber}
                  label="Phone Number"
                  onChange={({ target }) =>
                    this.setState({ phoneNumber: normalizePhone(target.value) })
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </DialogBox>
    );
  }
}

CreatePhoneCall.propTypes = {
  account: PropTypes.instanceOf(Account).isRequired,
  reminders: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleAction: PropTypes.func.isRequired,
  sendReminderPreviewCall: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  selectedTouchpoint: PropTypes.string,
};

CreatePhoneCall.defaultProps = {
  selectedTouchpoint: '',
};

export default CreatePhoneCall;

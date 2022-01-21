import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Account from '../../../../../entities/models/Account';
import { generateTwilioNumber, removeTwilioNumber } from '../../../../../thunks/settings';
import Field from '../../../../library/Form/Field';
import { Grid, Col, Row, Button, Tooltip } from '../../../../library';
import style from '../styles.scss';

function TwilioPhoneNumber({ activeAccount, ...props }) {
  const accountId = activeAccount.get('id');
  const hasTwilioPhoneNumber = !!activeAccount.get('twilioPhoneNumber');
  const hasDestinationPhoneNumber = !!activeAccount.get('destinationPhoneNumber');
  const generateConfirmation = () => {
    if (window.confirm('Are you sure you want to generate a new Twilio number?')) {
      props.generateTwilioNumber(accountId);
    }
  };
  const removeConfirmation = () => {
    if (window.confirm('Are you sure you want to remove your Twilio number?')) {
      props.removeTwilioNumber(accountId);
    }
  };

  const GenerateButtonComponent = (
    <Button
      icon="plus"
      onClick={generateConfirmation}
      disabled={!hasDestinationPhoneNumber || hasTwilioPhoneNumber}
      className={style.inlineButton}
    />
  );

  const buttonWithTooltip = hasDestinationPhoneNumber ? (
    GenerateButtonComponent
  ) : (
    <Tooltip trigger={['hover']} overlay="Destination Phone Number is required." placement="top">
      {GenerateButtonComponent}
    </Tooltip>
  );

  return (
    <Grid>
      <Row>
        <Col xs={9}>
          <Field
            name="twilioPhoneNumber"
            label="Twilio Phone Number"
            type="tel"
            data-test-id="twilioPhoneNumber"
          />
        </Col>
        <Col xs={3} className={style.buttonsWrapper}>
          {buttonWithTooltip}
          <Button
            icon="times"
            onClick={removeConfirmation}
            disabled={!hasTwilioPhoneNumber}
            className={style.inlineButton}
          />
        </Col>
      </Row>
    </Grid>
  );
}

TwilioPhoneNumber.propTypes = {
  activeAccount: PropTypes.instanceOf(Account).isRequired,
  generateTwilioNumber: PropTypes.func.isRequired,
  removeTwilioNumber: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      generateTwilioNumber,
      removeTwilioNumber,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(TwilioPhoneNumber);

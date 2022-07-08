import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Account from '../../../../../entities/models/Account';
import { generateCallRailKey, removeCallRailKey } from '../../../../../thunks/settings';
import Field from '../../../../library/Form/Field';
import { Grid, Col, Row, StandardButton as Button } from '../../../../library';
import style from '../styles.scss';

function CallRail({ activeAccount, ...props }) {
  const accountId = activeAccount.get('id');
  const hasCallRailId = !!activeAccount.get('callrailId') || !!activeAccount.get('callrailIdV3');
  const callRailFieldName = activeAccount.get('callrailId') ? 'callrailId' : 'callrailIdV3';
  const generateConfirmation = () => {
    if (window.confirm('Are you sure you want to generate a new CallRail key?')) {
      props.generateCallRailKey(accountId);
    }
  };
  const removeConfirmation = () => {
    if (window.confirm('Are you sure you want to remove your CallRail key?')) {
      props.removeCallRailKey(accountId);
    }
  };

  return (
    <Grid>
      <Row>
        <Col xs={9}>
          <Field name={callRailFieldName} label="CallRail ID" data-test-id="callrailId" />
        </Col>
        <Col xs={3} className={style.buttonsWrapper}>
          <Button
            icon="plus"
            onClick={generateConfirmation}
            disabled={hasCallRailId}
            className={style.inlineButton}
          />
          <Button
            icon="trash"
            variant="danger"
            onClick={removeConfirmation}
            disabled={!hasCallRailId}
            className={style.inlineButton}
          />
        </Col>
      </Row>
    </Grid>
  );
}

CallRail.propTypes = {
  activeAccount: PropTypes.instanceOf(Account).isRequired,
  generateCallRailKey: PropTypes.func.isRequired,
  removeCallRailKey: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      generateCallRailKey,
      removeCallRailKey,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(CallRail);

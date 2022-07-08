import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Account from '../../../../../entities/models/Account';
import { Field, StandardButton as Button, Grid, Row, Col } from '../../../../library';
import { generateVendastaKey, deleteVendastaKey } from '../../../../../thunks/settings';
import styles from '../styles.scss';

function VendastaInfo({ activeAccount, ...props }) {
  const { id, vendastaId } = activeAccount;

  const removeConfirmation = () => {
    if (window.confirm('Are you sure you want to remove your Vendasta key?')) {
      props.deleteVendastaKey(id);
    }
  };

  const generateConfirmation = () => {
    if (window.confirm('Are you sure you want to generate a new Vendasta key?')) {
      props.generateVendastaKey(id);
    }
  };

  return (
    <Grid>
      <Row>
        <Col xs={9}>
          <Field name="vendastaId" label="Vendasta Id" data-test-id="vendastaId" />
        </Col>
        <Col xs={3} className={styles.buttonsWrapper}>
          <Button
            icon="plus"
            disabled={!!vendastaId}
            onClick={generateConfirmation}
            className={styles.inlineButton}
          />
          <Button
            icon="trash"
            variant="danger"
            disabled={!vendastaId}
            onClick={removeConfirmation}
            className={styles.inlineButton}
          />
        </Col>
      </Row>
    </Grid>
  );
}

VendastaInfo.propTypes = {
  activeAccount: PropTypes.instanceOf(Account).isRequired,
  generateVendastaKey: PropTypes.func.isRequired,
  deleteVendastaKey: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      generateVendastaKey,
      deleteVendastaKey,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(VendastaInfo);

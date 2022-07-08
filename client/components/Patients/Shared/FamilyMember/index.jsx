import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { isResponsive } from '../../../../util/hub';
import { Grid, Row, Col, Avatar, Badge, Icon, StandardButton as Button } from '../../../library';
import HygieneData from '../HygieneColumn';
import RecallData from '../RecallColumn';
import InfoDump from '../InfoDump';
import { patientShape } from '../../../library/PropTypeShapes';
import ActionsDropdown from '../../PatientInfo/ActionsDropdown';
import styles from './styles.scss';

class FamilyMember extends React.Component {
  renderNameAge(fullName, age) {
    return (
      <ActionsDropdown
        patient={{
          id: this.props.node.ccId,
          isPhoneNumberAvailable: this.props.node.isPhoneNumberAvailable,
          isSMSEnabled: this.props.node.isSMSEnabled,
          isVoiceEnabled: this.props.node.isVoiceEnabled,
          phoneNumberType: this.props.node.phoneNumberType,
          ...this.props.patient,
        }}
        render={({ onClick }) => (
          <button
            type="button"
            tabIndex={0}
            className={styles.patientLink}
            onDoubleClick={() => this.props.push(`/patients/${this.props.node.ccId}`)}
            onClick={onClick}
            onKeyDown={(e) => e.keyCode === 13 && onClick()}
          >
            <p className={styles.familyMember_name}>{`${fullName}, ${age}`}</p>
            <div className={styles.actionsButtonSmall}>
              <Icon icon="caret-down" type="solid" className={styles.actionIcon} />
            </div>
          </button>
        )}
      />
    );
  }

  renderHeadBadge(text) {
    const { handleMakeHead, isHead } = this.props;

    return (
      (!handleMakeHead || isHead) && (
        <Badge containerStyle={styles.familyMember_config_head}>{text}</Badge>
      )
    );
  }

  renderButton(text, handler, remove = false) {
    return (
      <Button
        className={classNames([styles.familyMember_config_button], {
          [styles.familyMember_config_button_remove]: remove,
        })}
        onClick={handler}
        variant="secondary"
        icon={remove ? 'times' : null}
      >
        {text}
      </Button>
    );
  }

  renderDisplayHead(text = 'HEAD') {
    return this.props.isHead && this.renderHeadBadge(text);
  }

  renderMakeHead(text = 'Make Family Head') {
    return (
      this.props.handleMakeHead &&
      !this.props.isHead &&
      this.renderButton(text, this.props.handleMakeHead)
    );
  }

  renderRemoveFromFamily(text = 'Remove from this family') {
    return (
      this.props.handleRemoveFromFamily &&
      this.renderButton(text, this.props.handleRemoveFromFamily, true)
    );
  }

  renderBullet() {
    return <span className={styles.familyMember_config_bullet}>&#9679;</span>;
  }

  renderFamilyDisplay(props) {
    const {
      fullName,
      age,
      patient,
      lastApp,
      nextApp,
      className,
      activeAccount,
      avatarSize,
      timezone,
    } = props;

    const recallHygieneData = {
      patient,
      className,
      activeAccount,
      timezone,
    };

    return (
      <Row>
        <div xs={1} md={2} className={styles.familyMember_headColumn}>
          <Avatar user={patient} size={avatarSize} />
        </div>
        <Col xs={10} md={9}>
          <div className={styles.familyMember_row} middle="xs" start="xs">
            <Col>{this.renderNameAge(fullName, age)}</Col>
            <Col>{this.renderDisplayHead()}</Col>
          </div>
          <Row className={styles.familyMember_row}>
            <Col xs={6}>
              <InfoDump label="Last Appt" data={lastApp} />
            </Col>
            <Col xs={6}>
              <InfoDump label="Due For Hygiene" component={HygieneData(recallHygieneData)} />
            </Col>
          </Row>
          <Row className={styles.familyMember_row}>
            <Col xs={6}>
              <InfoDump label="Next Appt" data={nextApp} />
            </Col>
            <Col xs={6}>
              <InfoDump label="Due For Recall" component={RecallData(recallHygieneData)} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderFamilyConfig(props) {
    const { fullName, age, patient, isHead, avatarSize } = props;

    return (
      <Row middle="xs" start="xs">
        <Col xs={2} md={1}>
          <Avatar user={patient} size={avatarSize} />
        </Col>
        <Col xs className={styles.familyMember_config_col}>
          <Row
            start="xs"
            middle="xs"
            className={classNames([styles.familyMember_config_row], {
              [styles.familyMember_config_row_head]: isHead,
            })}
          >
            <Col>{this.renderNameAge(fullName, age)}</Col>
            <Col>{this.renderDisplayHead()}</Col>
          </Row>
          <Row className={styles.familyMember_config_row}>
            <Col xs={12}>
              {this.renderRemoveFromFamily()} {!isHead && this.renderBullet()}{' '}
              {!isHead && this.renderMakeHead()}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    const { withBorder, handleMakeHead, timezone } = this.props;

    const avatarSize = isResponsive() ? 'sm' : 'md';

    const finalProps = {
      ...this.props,
      timezone,
      avatarSize,
    };

    return (
      <Grid
        className={classNames({
          [styles.familyMember]: !this.props.handleMakeHead,
          [styles.familyMember_config]: this.props.handleMakeHead,
          [styles.familyMember_withBorder]: !this.props.handleMakeHead && withBorder,
          [styles.familyMember_config_withBorder]: this.props.handleMakeHead && withBorder,
        })}
      >
        {handleMakeHead
          ? this.renderFamilyConfig(finalProps)
          : this.renderFamilyDisplay(finalProps)}
      </Grid>
    );
  }
}

FamilyMember.propTypes = {
  patient: PropTypes.shape({
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  withBorder: PropTypes.bool,
  isHead: PropTypes.bool,
  handleMakeHead: PropTypes.func.isRequired,
  handleRemoveFromFamily: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  node: PropTypes.shape(patientShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

FamilyMember.defaultProps = {
  withBorder: false,
  isHead: false,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(FamilyMember);


import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isResponsive } from '../../../../util/hub';
import { Grid, Row, Col, Avatar, Badge } from '../../../library';
import HygieneData from '../HygieneColumn';
import RecallData from '../RecallColumn';
import InfoDump from '../InfoDump';
import styles from './styles.scss';

class FamilyMember extends React.Component {
  constructor(props) {
    super(props);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.state = { isHovering: false  };
  }

  mouseLeave() {
    this.setState({ isHovering: false });
  }

  mouseOver() {
    this.setState({ isHovering: true });
  }

  renderNameAge(fullName, age) {
    return (
      <span className={styles.familyMember_name}>{`${fullName}, ${age}`}</span>
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
      <button
        type="button"
        className={classNames([styles.familyMember_config_button], { [styles.familyMember_config_button_remove]: remove  })}
        onClick={handler}
      >
        {text}
      </button>
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
    } = props;

    const recallHygieneData = {
      patient,
      className,
      activeAccount,
    };

    return (
      <Row>
        <Col xs={2} md={3} className={styles.familyMember_headColumn}>
          <Avatar user={patient} size={avatarSize} />
        </Col>
        <Col xs={10} md={9}>
          <Row className={styles.familyMember_row} middle="xs" start="xs">
            <Col>{this.renderNameAge(fullName, age)}</Col>
            <Col>{this.renderDisplayHead()}</Col>
          </Row>
          <Row className={styles.familyMember_row}>
            <Col xs={6}>
              <InfoDump label="LAST APPT" data={lastApp} />
            </Col>
            <Col xs={6}>
              <InfoDump
                label="DUE FOR HYGIENE"
                component={HygieneData(recallHygieneData)}
              />
            </Col>
          </Row>
          <Row className={styles.familyMember_row}>
            <Col xs={6}>
              <InfoDump label="NEXT APPT" data={nextApp} />
            </Col>
            <Col xs={6}>
              <InfoDump
                label="DUE FOR RECALL"
                component={RecallData(recallHygieneData)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderFamilyConfig(props) {
    const { fullName, age, patient, isHead, avatarSize  } = props;

    return (
      <Row middle="xs" start="xs">
        <Col xs={2} md={1}>
          <Avatar user={patient} size={avatarSize} />
        </Col>
        <Col xs className={styles.familyMember_config_col}>
          <Row
            start="xs"
            middle="xs"
            className={classNames([styles.familyMember_config_row], { [styles.familyMember_config_row_head]: isHead  })}
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
    const { withBorder, handleMakeHead } = this.props;

    const avatarSize = isResponsive() ? 'sm' : 'md';

    const finalProps = {
 ...this.props,
      avatarSize 
};

    return (
      <Grid
        className={classNames({
          [styles.familyMember]: !this.props.handleMakeHead,
          [styles.familyMember_config]: this.props.handleMakeHead,
          [styles.familyMember_withBorder]:
            !this.props.handleMakeHead && withBorder,
          [styles.familyMember_config_withBorder]:
            this.props.handleMakeHead && withBorder,
        })}
        onMouseLeave={() => this.mouseLeave()}
        onMouseOver={() => this.mouseOver()}
      >
        {handleMakeHead
          ? this.renderFamilyConfig(finalProps)
          : this.renderFamilyDisplay(finalProps)}
      </Grid>
    );
  }
}

FamilyMember.propTypes = {
  fullName: PropTypes.string,
  age: PropTypes.number,
  patient: PropTypes.shape({
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  lastApp: PropTypes.string,
  nextApp: PropTypes.string,
  withBorder: PropTypes.bool,
  isHead: PropTypes.bool,
  handleMakeHead: PropTypes.func,
  handleRemoveFromFamily: PropTypes.func,
  className: PropTypes.string,
  activeAccount: PropTypes.bool,
};

export default FamilyMember;

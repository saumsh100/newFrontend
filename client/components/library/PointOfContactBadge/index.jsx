
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import cap from '../../../../iso/helpers/string/capitalize';
import { Tooltip } from '..';
import PatientQueryRenderer from '../PatientQueryRenderer';
import XIcon from './XIcon';
import CheckIcon from './CheckIcon';
import styles from './styles.scss';

const Spinner = () => (
  <div className={styles.spinner}>
    <div className={styles.double_bounce1} />
    <div className={styles.double_bounce2} />
  </div>
);

/**
 * Renders the appropriated icon to display if the patient is point of contact for that channel
 * @param {*} props.patientId
 * @param {*} props.channel
 */
class PointOfContactBadge extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isTooltipVisible: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isTooltipVisible: true });
    }, 2200);
  }

  renderBadge(isPoC) {
    const { isTooltipVisible } = this.state;
    const toolTipText = <span>{`${isPoC ? '' : 'Not '}Point of Contact`}</span>;

    return (
      <span className={classnames(styles.pocBadge, { [styles.isPoC]: isPoC })}>
        <Spinner />
        {isTooltipVisible && (
          <Tooltip placement="top" trigger={['hover']} overlay={toolTipText}>
            <div className={styles.badge}>{isPoC ? <CheckIcon /> : <XIcon />}</div>
          </Tooltip>
        )}
      </span>
    );
  }

  render() {
    const { patientId, channel } = this.props;

    if (!patientId) {
      return this.renderBadge(true);
    }

    return (
      <PatientQueryRenderer patientId={patientId}>
        {(data) => {
          if (!('accountViewer' in data)) {
            return null;
          }
          const isPoC = data.accountViewer.patient[`is${cap(channel)}Poc`];
          return this.renderBadge(isPoC);
        }}
      </PatientQueryRenderer>
    );
  }
}

PointOfContactBadge.propTypes = {
  patientId: PropTypes.string.isRequired,
  channel: PropTypes.oneOf(['phone', 'email']).isRequired,
};

export default PointOfContactBadge;

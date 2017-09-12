import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Icon } from '../../../../library';
import styles from '../styles.scss';
import { updateEntityRequest } from '../../../../../thunks/fetchEntities';


class CallList extends Component {
  constructor(props) {
    super(props);
    this.sendEdit = this.sendEdit.bind(this);
  }

  sendEdit(id, e) {
    const wasApptBooked = e.target.value === 'true';

    this.props.updateEntityRequest({
      key: 'calls',
      values: { wasApptBooked },
      alert: {
        success: {
          body: 'Call Updated',
        },
        error: {
          body: 'Call Not Updated',
        },
      },
      url: `/api/calls/${id}`,
    });
  }

  render() {
    const {
      id,
      callSource,
      startTime,
      callerNum,
      callerCity,
      callerName,
      duration,
      answered,
      wasApptBooked,
      recording,
    } = this.props;

    const phoneClass = answered ? styles.phone : styles.phoneMissed;
    let durationMissed = answered ? duration : 'unanswered';

    if (durationMissed !== 'unanswered' && durationMissed > 60) {
      durationMissed = `${Math.round(durationMissed / 60)}min ${duration % 60}sec`;
    } else {
      durationMissed = durationMissed !== 'unanswered' ? `${durationMissed}s` : durationMissed;
    }
    return (<tr>
        <td className={styles.column}><Icon icon="phone" className={phoneClass} />&emsp;<span className={styles.column_source}>{callSource}</span></td>
      <td className={styles.column}>{moment(startTime).format('LLL')}</td>
      <td className={styles.column}>{callerName}</td>
      <td className={styles.column}>{callerNum}</td>
      <td className={styles.column}>{callerCity}</td>
      <td className={styles.column}>{durationMissed}</td>
      <td className={styles.column}>
        <form
          className={styles.position}
          key={`form${id}`}
        >
          <div className={styles.switchField}>
            <input
              type="radio"
              onChange={this.sendEdit.bind(null, id)}
              id={`switch_${id}_left`}
              name={`switch_${id}`}
              value="true"
              checked={wasApptBooked}
            />
            <label htmlFor={`switch_${id}_left`}>YES</label>
            <input
              type="radio"
              onChange={this.sendEdit.bind(null, id)}
              id={`switch_${id}_right`}
              name={`switch_${id}`}
              value="false"
              checked={!wasApptBooked}
            />
            <label htmlFor={`switch_${id}_right`}>NO</label>
          </div>
        </form>
      </td>
      <td className={styles.column}>
        <a href={recording} target="_blank" rel="noopener noreferrer">
          <svg fill="#000000" className={styles.icon} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 8v8l5-4-5-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
          </svg>
        </a>
      </td>
    </tr>
    );
  }
}

CallList.propTypes = {
  updateEntityRequest: PropTypes.func.isRequired,
  id: PropTypes.string,
  callSource: PropTypes.string,
  startTime: PropTypes.string,
  callerNum: PropTypes.string,
  callerCity: PropTypes.string,
  callerName: PropTypes.string,
  recording: PropTypes.string,
  duration: PropTypes.string,
  answered: PropTypes.boolean,
  wasApptBooked: PropTypes.boolean,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(CallList);


import React from 'react';
import ModeReport from '../../ModeReport';
import Parameters from '../Parameters';
import styles from '../styles.scss';

class CallTracking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account_name: null,
      start_date: null,
      end_date: null,
      filled: false,
    };
  }

  render() {
    return (
      <div className={styles.page}>
        <Parameters
          handleClick={state =>
            this.setState({
              ...state,
              filled: true,
            })
          }
        />
        {this.state.filled && (
          <ModeReport
            reportId="b066e775f66a"
            parameters={{
              account_name: this.state.account_name,
              start_date: this.state.start_date,
              end_date: this.state.end_date,
            }}
          />
        )}
      </div>
    );
  }
}

export default CallTracking;

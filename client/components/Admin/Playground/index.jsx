
import React, { Component } from 'react';
import { Button } from '../../library';
import ModeReport from '../../ModeReport';
import styles from './styles.scss';

const acu = '41ed3497-fb86-4d0c-94bf-a2db0912ed0a';
const gal = 'c05ade0e-eb8a-44ed-bf3c-a83bfa4bc5a3';

export default class Playground extends Component {
  constructor(props) {
    super(props);
    this.state = { accountId: acu };
  }

  render() {
    return (
      <div className={styles.page}>
        <Button title="Acu Dental" onClick={() => this.setState({ accountId: acu })} />
        <Button title="Gallery Dental" onClick={() => this.setState({ accountId: gal })} />
        <ModeReport
          reportId="b066e775f66a"
          parameters={{
            account_name: this.state.accountId,
            start_date: '2017-10-01',
            end_date: '2019-10-01',
          }}
        />
      </div>
    );
  }
}

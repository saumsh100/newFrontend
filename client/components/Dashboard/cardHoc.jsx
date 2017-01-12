import React, { PropTypes } from 'react';
import { Card, Button } from '../library';
import styles from './styles.scss';

const Loading = () => {
  return (
    <div className={styles.loadingOuter}>
      <div className={styles.loadingInner}>
        Loading
      </div>
    </div>
  );
};

export default function CardHoc(Component) {
  return function (props) {
    return (
      <Card style={{minHeight: '480px'}}>
        {props.status === 'loading' && <Loading />}
        <div>
          <h3>
            {props.title}
          </h3>
        </div>
        {props.lastFetched && <Component {...props}/>}
        {props.lastFetched &&
          <div style={{ padding: '20px'}}>
            <div>
              Last Fetched on {props.lastFetched}
            </div>
            <Button onClick={props.reload}>Reload</Button>
          </div>
        }
      </Card>
    );
  }
}


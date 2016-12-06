import React, { PropTypes } from 'react';
import { Card, CardBlock, CardTitle } from 'reactstrap';
import styles from './styles.scss'

function Loading () {
  return (
    <div className={styles.loadingOuter}>
      <div className={styles.loadingInner}>
        Loading
      </div>
    </div>);
}

export default function CardHoc(Component) {
  return function (props) {
    return (
      <Card style={{minHeight: '480px'}}>
        {props.status === 'loading' && <Loading />}
        <CardBlock>
          <CardTitle>
            {props.title}
          </CardTitle>
        </CardBlock>
        {props.lastFetched && <Component {...props}/>}
        {props.lastFetched && 
          <CardBlock style={{ padding: '20px'}}>
            <div>
              Last Fetched on {props.lastFetched} 
            </div>
            <button className={styles.reloadButton} onClick={props.reload}> Reload </button>
          </CardBlock>
        }
      </Card>);
  }
}


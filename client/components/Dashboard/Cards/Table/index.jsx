import React, { Component } from 'react';
import { Card, CardHeader } from '../../../library';
import Search from '../../../library/Search';
import styles from './styles.scss';

class Table extends Component {
  render() {
    const {
      borderColor,
      cardCount,
      cardTitle,
      className,
    } = this.props;
    return (
      <Card className={`${className} ${styles.table}`} >
        <div className={styles.table__header}>
          <CardHeader count={7} title={cardTitle}>
            <Search min/>
          </CardHeader>
        </div>
        <div className={styles.table__body}>
          <div className={styles.table__items}></div>
        </div>
      </Card>
    );
  }
}


export default Table;

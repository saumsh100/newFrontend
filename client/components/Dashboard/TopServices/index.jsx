import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Icon } from '../../library';
import styles from './styles.scss';


class TopServices extends Component {
  render() {
    const hardcodeData = [{
      title: "Invisalign",
      hours: 42
    },{
      title: "Invisalign",
      hours: 42
    },{
      title: "Invisalign",
      hours: 42
    },{
      title: "Invisalign",
      hours: 42
    },{
      title: "Invisalign",
      hours: 42
    }];
    const {
      cardCount,
      cardTitle,
    } = this.props;
    return (
      <Card className={styles.topServices}>
        <div className={styles.topServices__header}>
          <CardHeader title={cardTitle} />
        </div>
        <div className={styles.topServices__body}>
          <List className={styles.data}>
            {hardcodeData.map(obj => {
              return (
                <ListItem className={styles.data__item}>
                  <div className={styles.data__item_wrapper}>
                    <div className={styles.data__item_left}>
                      <div className={styles.data__item_title}>
                        <spam>{obj.title}</spam>
                      </div>
                    </div>
                    <div className={styles.data__item_right}>
                      <div className={styles.data__item_hours}>
                        <span>{obj.hours + " h"}</span>
                      </div>
                    </div>
                  </div>
                </ListItem>
              )
            })}
          </List>
        </div>
      </Card>
    );
  }
}


export default TopServices;

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
      <Card className={styles.reminders}>
        <div className={styles.reminders__header}>
          <CardHeader title={cardTitle} />
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {hardcodeData.map(obj => {
              return (
                <ListItem className={styles.patients__item}>
                  <div className={styles.patients__item_wrapper}>
                    <div className={styles.patients__item_left}>
                      <div className={styles.patients__item_name}>
                        <spam>{obj.title}</spam>
                      </div>
                    </div>
                    <div className={styles.patients__item_right}>
                      <span>{obj.hours + " h"}</span>
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

import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Icon } from '../../library';
import colorMap from '../../library/util/colorMap';
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

      cardTitle,
    } = this.props;
    return (
      <Card className={styles.topServices} borderColor={colorMap.red}>
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

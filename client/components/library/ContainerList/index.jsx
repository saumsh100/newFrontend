import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader } from '../../library';
import classnames from 'classnames'
import styles from './styles.scss';


class ContainerList extends Component {
  render() {
    const {
      data,
      borderColor,
      cardTitle,
      className
    } = this.props;
    return (
      <Card className={classnames(className, styles.containerList)} borderColor={borderColor}>
        <div className={styles.containerList__header}>
          <CardHeader title={cardTitle} />
        </div>
        <div className={styles.containerList__body}>
          <List className={styles.data}>
            {data.map(obj => {
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
                        {obj.hours && <span>{obj.hours}h</span>}
                        {obj.data && <span>${obj.data}</span>}
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


export default ContainerList;

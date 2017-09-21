import React, { Component } from 'react';
import { Col, List, ListItem, Card, CardHeader } from '../../../../../library';
import styles from './styles.scss';
import Avatar from '../../../../../library/Avatar/index';

class Item extends Component {
  render() {
    const {
      data,
      borderColor,
      cardTitle,
    } = this.props;
    return (
      <Col className={styles.paddingFill} xs={12} sm={6} md={3}>
        <Card className={styles.userItem}>
          <div className={styles.userItem__header}>
            <CardHeader title={cardTitle}/>
          </div>
          <div className={styles.userItem__body}>
            <List className={styles.patients}>
              {data.map((obj, i) => {
                console.log(obj)
                return (
                  <ListItem key={i} className={styles.patients__item}>
                    <Avatar className={styles.patients__item_img} user={obj} size="lg"/>
                    <div className={styles.patients__item_wrapper}>
                      <div className={styles.patients__item_left}>
                        <div className={styles.patients__item_name}>
                          {obj.name}, <span>{obj.age}</span>
                        </div>
                      </div>
                      <div className={styles.patients__item_right}>
                        <div className={styles.patients__item_number}>
                          {obj.number}
                        </div>
                      </div>
                    </div>
                  </ListItem>
                )
              })}
            </List>
          </div>
        </Card>
      </Col>
    );
  }
}


export default Item;

import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Search, IconButton} from '../../../library';
import colorMap from '../../../library/util/colorMap';
import styles from './styles.scss';


class Referrals extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let showHoverComponents = (<div className={styles.clickHandlers__newreqText}>New</div>);
    showHoverComponents = (
      <div>
        <div className={styles.clickHandlers}>
          <IconButton
            icon={'times-circle-o'}
            className={styles.clickHandlers__remove}
          />
          <IconButton
            icon={'check-circle'}
            className={styles.clickHandlers__confirm}
          />
        </div>
      </div>
    )

    const {
      cardCount,
      cardTitle,
      data,
    } = this.props;

    return (
      <Card className={styles.referrals} borderColor={colorMap.red}>
        <div className={styles.referrals__header}>
          <CardHeader title={cardTitle} count={data.length}>
            <Search min calendar className={styles.referrals__search} />
          </CardHeader>
        </div>
        <div className={styles.referrals__body}>
          <List className={styles.data}>
            {data.map(obj => {
              return (
                <ListItem className={styles.referrals__item}>
                  <img className={styles.referrals__item_img} src={obj.img} alt=""/>
                  <div className={styles.referrals__item_wrapper}>
                    <div className={styles.referrals__item_left}>
                      <div className={styles.referrals__item_name}>
                        <b>{obj.name}, <span>{obj.age}</span></b>
                      </div>
                      <div className={styles.referrals__item_from}>
                        From: {obj.from} on {obj.date}
                      </div>
                      <div className={styles.referrals__item_phone}>
                        {obj.phone}
                      </div>
                      <div className={styles.referrals__item_email}>
                        {obj.email}
                      </div>
                    </div>
                  </div>
                  <div className={styles.referrals__item_icon}>
                    {showHoverComponents}
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


export default Referrals;

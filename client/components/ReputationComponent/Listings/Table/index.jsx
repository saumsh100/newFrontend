
import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Icon } from '../../../library';
import styles from './styles.scss';


class Table extends Component {
  constructor(props) {
    super(props);
    this.toggleDetailes = this.toggleDetailes.bind(this);
    this.state = {
      detailsModeActive: false,
    };
  }
  toggleDetailes() {
    this.setState({
      detailsModeActive: !this.state.detailsModeActive,
    });
  }
  render() {
    const hardcodeData = [{
      data:
        [{
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'lwater12@gmail.com',
          listing: 0,
        }, {
          img: '/images/services/voyager.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'emilee1@gmail.com',
          listing: 26,
        }, {
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'barlet@gmail.com',
          listing: 54,
        }] }, {
      title: 'Review Sites',
      data:
        [{
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'lwater12@gmail.com',
          listing: 0,
        }, {
          img: '/images/services/voyager.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'emilee1@gmail.com',
          listing: 26,
        }, {
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'barlet@gmail.com',
          listing: 0,
        }] }, {
      title: 'Review Sites',
      data:
        [{
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'lwater12@gmail.com',
          listing: 0,
        }, {
          img: '/images/services/voyager.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'emilee1@gmail.com',
          listing: 26,
        }, {
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'barlet@gmail.com',
          listing: 0,
        }] }];
    const {
      borderColor,
      cardTitle,
    } = this.props;
    const { detailsModeActive } = this.state;
    return (
      <Card className={styles.mostLoyal} borderColor={borderColor}>
        <div className={styles.mostLoyal__header}>
          <CardHeader
            className={styles.mostLoyal__header_item}
            title={cardTitle}
          >
            <a className={styles.mostLoyal__header_link}>Print Listings Repost</a>
          </CardHeader>
        </div>
        {hardcodeData.map(obj => (
          <div className={styles.mostLoyal__body}>
            {obj.title ? (
              <div className={styles.mostLoyal__header}>
                <div className={styles.mostLoyal__header_title}>
                  <div>{obj.title}</div>
                </div>
                <div className={styles.mostLoyal__header_cell} />
              </div>) : ''}
            <List className={styles.data}>
              {obj.data.map(obj => (
                <ListItem className={styles.data__item}>
                  <div className={styles.data__item_wrapper}>
                    <div className={styles.data__item_left}>
                      <img className={styles.data__item_img} src={obj.img} alt="" />
                      <div className={styles.data__item_personal}>
                        <div className={styles.data__item_name}>
                          {obj.name}
                        </div>
                        <a className={styles.data__item_phone}>
                          Notes
                        </a>
                      </div>
                    </div>
                    <div className={styles.data__item_center}>
                      <div className={styles.data__item_status}>
                        <div className={styles.status__icon}>
                          {obj.listing ? <Icon className={styles.status__icon_check} icon="check" /> : <Icon className={styles.status__icon_times} icon="times" />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.data__item_right}>
                      <div onClick={this.toggleDetailes}
                           className={styles.data__item_table}>
                        <div className={styles.table__text}>
                          {obj.listing ? <div>Accurate listing found</div> : <div>Listing not found</div>}
                        </div>
                        {detailsModeActive ?
                          (<div className={styles.table__data}>Fix your Listing together with 30+ sites.</div>) :
                          (<div onClick={this.toggleDetailes} className={styles.table__button}>
                            <Icon icon="plus-square-o" /> show details</div>)}
                      </div>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </Card>
    );
  }
}


export default Table;

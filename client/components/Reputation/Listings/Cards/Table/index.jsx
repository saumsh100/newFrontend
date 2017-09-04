
import React, { Component, PropTypes } from 'react';
import { List, ListItem, Card, CardHeader, Icon } from '../../../../library';
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
    const {
      borderColor,
      cardTitle,
      data,
      tableData,
    } = this.props;

    console.log(tableData.searchengines)
    const { detailsModeActive } = this.state;

    return (
      <Card
        className={styles.mostLoyal}
      >
        <div className={styles.mostLoyal__header}>
          <CardHeader
            className={styles.mostLoyal__header_item}
            title={cardTitle}
          >
            {/*<a className={styles.mostLoyal__header_link}>Print Listings Repost</a>*/}
          </CardHeader>
        </div>
        <div className={styles.mostLoyal__wrapper}>
          {data.map((obj, i) => (
            <div
              key={i}
              className={styles.mostLoyal__body}
            >
              {obj.title ? (
                <div className={styles.mostLoyal__subheader}>
                  <div className={styles.mostLoyal__subheader_title}>
                    <div>{obj.title}</div>
                  </div>
                  <div className={styles.mostLoyal__subheader_cell} />
                </div>) : ''}
              <List className={styles.data}>
                {obj.data.map((obj, i) => (
                  <ListItem
                    key={i}
                    className={styles.data__item}
                  >
                    <div className={styles.data__item_wrapper}>
                      <div className={styles.data__item_left}>
                        <img className={styles.data__item_img} src={obj.img} alt="" />
                        <div className={styles.data__item_personal}>
                          <div className={styles.data__item_name}>
                            {obj.name}
                          </div>
                          <a className={styles.data__item_phone}>
                            notes
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
                        <div
                          onClick={this.toggleDetailes}
                          className={styles.data__item_table}
                        >
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
        </div>
      </Card>
    );
  }
}

Table.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default Table;

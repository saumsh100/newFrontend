import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List, ListItem, Card, Icon } from '../../../../library';
import styles from './styles.scss';
import ShowDetails from './ShowDetails';
import Collapsible from '../../../../library/Collapsible/index';

class Table extends Component {
  constructor(props) {
    super(props);
    this.toggleDetailes = this.toggleDetailes.bind(this);
    this.state = { detailsModeActive: false };
  }

  toggleDetailes() {
    this.setState({ detailsModeActive: !this.state.detailsModeActive });
  }

  render() {
    const { data } = this.props;

    return (
      <Card className={styles.mostLoyal}>
        <div className={styles.mostLoyal__wrapper}>
          {data.length ? (
            data.map((obj, i) => (
              <div key={i} className={styles.mostLoyal__body}>
                {obj.title ? (
                  <div className={styles.mostLoyal__subheader}>
                    <div className={styles.mostLoyal__subheader_title}>
                      <div>{obj.title}</div>
                    </div>
                    <div className={styles.mostLoyal__subheader_cell} />
                  </div>
                ) : (
                  ''
                )}
                <List className={styles.data}>
                  {obj.data.map((obj, i) => {
                    const listingInfo = obj.listing.length ? obj.listing[0].url : null;

                    let accurateListing = <div>Listing not found</div>;
                    let accurateListingIcon = (
                      <Icon className={styles.status__icon_times} icon="times" />
                    );

                    if (obj.listing.length) {
                      accurateListing = <div>Accurate listing found</div>;
                      accurateListingIcon = (
                        <Icon className={styles.status__icon_check} icon="check" />
                      );
                      const warning = obj.listing[0].anchorDataWarningFlag;

                      if (warning) {
                        accurateListing = <div> Listing found with possible errors </div>;
                        accurateListingIcon = (
                          <Icon className={styles.status__icon_exclamation} icon="exclamation" />
                        );
                      }
                    }

                    return (
                      <ListItem key={i} className={styles.data__item}>
                        <div className={styles.data__item_wrapper}>
                          <div className={styles.data__item_left}>
                            <img className={styles.data__item_img} src={obj.img} alt="" />
                            <div className={styles.data__item_personal}>
                              <div className={styles.data__item_name}>{obj.name}</div>
                            </div>
                          </div>
                          <div className={styles.data__item_center}>
                            <div className={styles.data__item_status}>
                              <div className={styles.status__icon}>{accurateListingIcon}</div>
                            </div>
                          </div>
                          <div className={styles.data__item_right}>
                            <div
                              onClick={this.toggleDetailes}
                              className={styles.data__item_table}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.keyCode === 13 && this.toggleDetailes()}
                            >
                              <div className={styles.table__text}>{accurateListing}</div>
                              {!obj.listing.length ? null : (
                                <div className={styles.table__button}>
                                  <Collapsible title="show details">
                                    <ShowDetails listingData={obj.listing} url={listingInfo} />
                                  </Collapsible>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            ))
          ) : (
            <div className={styles.clearedListings}>Please Select a Filter Option</div>
          )}
        </div>
      </Card>
    );
  }
}

Table.propTypes = { data: PropTypes.arrayOf(PropTypes.object).isRequired };

export default Table;

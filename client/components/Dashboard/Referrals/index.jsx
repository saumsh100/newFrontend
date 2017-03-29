import React, { Component } from 'react';
import { List, ListItem, Card, CardHeader, Search, IconButton} from '../../library';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';


class Referrals extends Component {
  constructor() {
    super();
    this.state = {
      isHovered: false
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

  }
  onMouseOver(){
    this.setState({
      isHovered: true,
    })
  }
  onMouseOut(){
    this.setState({
      isHovered: false,
    })
  }
  render() {
    const hardcodeData = [{
      img: "images/patient_1.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },{
      img: "images/patient_2.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },{
      img: "images/patient_3.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },{
      img: "images/patient_4.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },];

    let showHoverComponents = (<div className={styles.clickHandlers__newreqText}>New</div>);
    if(this.state.isHovered) {
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
    }
    const {
      cardCount,
      cardTitle,
    } = this.props;
    return (
      <Card className={styles.referrals} borderColor={colorMap.red}>
        <div className={styles.referrals__header}>
          <CardHeader title={cardTitle} count={cardCount} />
        </div>
        <div className={styles.referrals__searchContainer}>
          <Search min calendar className={styles.referrals__search} />
        </div>
        <div className={styles.referrals__body}>
          <List className={styles.data}>
            {hardcodeData.map(obj => {
              return (
                <ListItem className={styles.referrals__item}>
                  <img className={styles.referrals__item_img} src={obj.img} alt=""/>
                  <div onMouseOver={this.onMouseOver}
                       onMouseOut={this.onMouseOut}
                       className={styles.referrals__item_wrapper}>
                    <div className={styles.referrals__item_left}>
                      <div className={styles.referrals__item_name}>
                        <b>{obj.name}, <span>{obj.age}</span></b>
                      </div>
                      <div className={styles.referrals__item_phone}>
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

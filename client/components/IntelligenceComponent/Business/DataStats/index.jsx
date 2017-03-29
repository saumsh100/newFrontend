
import React, { PropTypes, Component } from 'react';
import { Card, Row, Col, Tabs, Tab, Icon   } from '../../../library'
import classNames from 'classnames';
import styles from './styles.scss';

class DataStats extends Component{
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    this.setState({ index });
  }
  render() {
    const {
      borderColor,
      data
    } = this.props;
    const hardcodeData1 = [
      {count: 202, icon: "phone"},
      {count: 141, icon: "user"},
      {count: 71, icon: "calendar-o"},];
    const hardcodeData2 = [
      {percentage: 2, subtitle: "Calls From Website"},
      {percentage: 70, subtitle: "Pickups"},
      {percentage: 53, subtitle: "Booking"},];

    return (
      <Card  borderColor={borderColor} className={styles.dataStats}>
        <Row className={styles.dataStats__wrapper}>
          <Col className={styles.dataStats__left} sm={12} md={4}>
            <div className={styles.left}>
              <Tabs index={this.state.index} onChange={this.handleTabChange}>
                {data.map((obj) => {
                  return (
                    <Tab label={obj.label}>
                      <div className={styles.left__wrapper}>
                        <Icon className={styles.left__icon} icon={obj.data.icon} size={4.1}/>
                        <div className={styles.left__count}>
                          {obj.data.count}
                        </div>
                        <div className={styles.left__title}>
                          {obj.data.title}
                        </div>
                      </div>
                    </Tab>
                  )
                })}
              </Tabs>
            </div>
          </Col>
          <Col className={styles.dataStats__right} sm={12} md={8}>
            <div className={styles.right}>
              <Col className={styles.right__item} sm={12} md={7}>
                <ul className={styles.right__list}>
                  {hardcodeData1.map((d) => {
                    return (
                      <li className={styles.right__list_item}>
                        <div className={styles.data}>
                          <div className={styles.data__wrapper}>
                            <span className={styles.data__count}>{d.count}</span>
                            <Icon className={styles.data__icon} icon={d.icon} size={2}/>
                          </div>
                        </div>
                        <div className={styles.arrow}></div>
                      </li>
                    )
                  })}
                </ul>
              </Col>
              <Col className={styles.right__item} sm={12} md={5}>
                <ul className={styles.right__percentage}>
                  {hardcodeData2.map((d) => {
                    return (
                      <li className={styles.right__percentage_item}>
                        <div className={styles.information}>
                          <div className={styles.information__count}>{d.percentage}%</div>
                          <div className={styles.information__subtitle}>
                            {d.subtitle}
                          </div>
                        </div>
                        <div className={styles.information__question}>
                          <Icon icon="question-circle" size={1.5} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </Col>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}
export default DataStats;

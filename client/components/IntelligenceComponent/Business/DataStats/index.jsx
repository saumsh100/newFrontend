
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
      data
    } = this.props;
    return (
      <Card className={styles.dataStats}>
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
          </div>
        </Col>
      </Card>
    );
  }
}
export default DataStats;

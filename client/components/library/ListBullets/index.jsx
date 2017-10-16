import React, { Component, PropTypes } from 'react';
import Icon from '../Icon';
import styles from './styles.scss';

class ListBullets extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      length,
      index,
      setIndex,
    } = this.props;

    const bullets = [];

    for (let i=0; i<length; i++) {
      if (i !== index) {
        bullets.push(
          <div className={styles.padding}>
            <Icon
              icon="circle-thin"
              onClick={() => {
                if (i < index) {
                  setIndex(i);
                }
              }}
            />
          </div>
        );
      } else {
        bullets.push(
          <div className={styles.padding}>
            <Icon icon="circle" />
          </div>
        );
      }
    }

    return (
      <div className={styles.listBullets}>
        {bullets.map((bullet) => {
          return bullet;
        })}
      </div>
    )
  }
}


export default ListBullets;

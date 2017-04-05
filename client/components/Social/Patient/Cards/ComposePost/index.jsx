import React, { Component } from 'react';
import { Card, Col, BackgroundIcon, Icon } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from './styles.scss';

class ComposePost extends Component {
  render() {
    const { headerTabs } = this.props;
    return (
      <Card className={styles.post}>
        <Col
          sm={12} md={8}
          className={styles.post__left}
        >
          <div className={styles.post__left_header}>
            <div className={styles.post__left_headerTitle}>Compose a Post</div>
            <div className={styles.header}>
              <div className={styles.header__add}>
                <BackgroundIcon
                  icon="plus"
                  color={colorMap.blue}
                  fontSize={1.4}
                />
                <span>
                  Add Profile
                </span>
              </div>
              <div className={styles.header__tags}>
                {headerTabs.map((obj, i) => (
                  <div
                    key={i}
                    className={styles.header__tags_item}
                  >
                    <BackgroundIcon
                      icon={obj.icon}
                      color={colorMap[obj.color]}
                      fontSize={1.2}
                      className={styles.header__tags_icon}
                    />
                    <div className={styles.header__tags_text}>
                      {obj.company}
                    </div>
                    <Icon
                      icon="close"
                      className={styles.header__tags_close}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.post__left_body}>
            <div className={styles.body}>
              <div className={styles.body__comment}>
                <textarea
                  maxLength="140"
                  className={styles.body__comment_element}
                />
                <div className={styles.body__comment_maxLength}>
                  <Icon icon="twitter" />
                  <span >140</span>
                </div>
              </div>
              <div className={styles.body__footer}>
                <div className={styles.body__footer_element}>
                  <Icon icon="link" />
                  <span>
                    Shared Link
                  </span>
                </div>
                <div className={styles.body__footer_element}>
                  <Icon icon="picture-o" />
                  <span>
                    Upload a Images
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col
          sm={12} md={4}
          className={styles.post__right}
        >
          <div className={styles.post__right_preview}>
            <div className={styles.preview}>
              <div className={styles.preview__title}>
              </div>
              <div className={styles.preview__body} />
            </div>
          </div>
        </Col>
      </Card>
    );
  }
}

export default ComposePost;


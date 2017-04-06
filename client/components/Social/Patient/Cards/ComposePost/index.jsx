import React, { Component } from 'react';
import { Card, Col, BackgroundIcon, Icon, IconButton, Label } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from './styles.scss';

class ComposePost extends Component {
  constructor() {
    super();
    this.state = {
      maxPostLength: 140,
      imageUpload: false,
    };
    this.handlerImageUpload = this.handlerImageUpload.bind(this);
  }
  handlerImageUpload() {
    this.setState({
      imageUpload: !this.state.imageUpload,
    });
  }
  render() {
    const { maxPostLength } = this.state;
    const { headerTabs, socialPreview } = this.props;
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
                  <Label
                    text={obj.company}
                  >
                    <BackgroundIcon
                      icon={obj.icon}
                      color={colorMap[obj.color]}
                      fontSize={1.2}
                      className={styles.header__tags_icon}
                    />
                  </Label>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.post__left_body}>
            <div className={styles.body}>
              <div className={styles.body__comment}>
                <textarea
                  maxLength={maxPostLength}
                  className={styles.body__comment_element}
                >Have you heard about our new Teeth Whitening Promotion?
                </textarea>
                <div className={styles.body__comment_maxLength}>
                  <Icon icon="twitter" />
                  <span>{maxPostLength}</span>
                </div>
              </div>
              <div className={styles.body__footer}>
                <div className={styles.body__footer_element}>
                  <Icon icon="link" />
                  <span>
                    Shared Link
                  </span>
                </div>
                <div
                  onClick={this.handlerImageUpload}
                  className={styles.body__footer_element}
                >
                  {!this.state.imageUpload ?
                    <div>
                      <Icon icon="picture-o" />
                      <span>
                      Upload a Images
                    </span>
                    </div> : <div className={styles.body__footer_tag}>
                      <Label text="Dentist 2.jpeg(1,5MB)">
                        <Icon icon="image" />
                      </Label>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col
          sm={12} md={4}
          className={styles.post__right}
        >
          <IconButton
            icon="trash"
            className={styles.post__right_icon}
          />
          <div className={styles.post__right_preview}>
            {socialPreview.map((obj, i) => (
              <div
                key={i}
                className={styles.preview}
              >
                <div className={styles.preview__title}>{`${obj.company} Preview`}</div>
                <div className={styles.preview__body}>
                  <div className={styles.preview__body_text}>
                    {obj.message}
                    {obj.image && <img className={styles.preview__body_img} src={obj.image} alt="dental" />}
                  </div>
                  <Icon
                    className={styles.preview__body_icon}
                    icon="times"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.post__right_footer}>
            <div className={styles.post__right_footerElement}>
              <Icon icon="calendar" />
              <span>Schedule a Post</span>
            </div>
            <div className={styles.post__right_footerElement}>
              <Icon icon="picture-o" />
              <span>Post</span>
            </div>
          </div>
        </Col>
      </Card>
    );
  }
}

export default ComposePost;


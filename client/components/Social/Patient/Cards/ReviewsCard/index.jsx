import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, BigCommentBubble, Col, Modal } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import ComposePost from '../ComposePost';
import styles from './styles.scss';

class ReviewsCard extends Component {
  constructor(props) {
    super(props);
    this.setActive = this.setActive.bind(this);
    this.state = {
      active: false,
    };
  }
  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }
  render() {
    const { data, headerTabs, socialPreview } = this.props;
    return (
      <Card
        className={styles.card}
      >
        <CardHeader
          className={styles.cardHeader}
          title={'RECENT ACTIVITY'}>
          <div onClick={this.setActive} className={styles.cardHeader_textCompose}>
            Compose
          </div>
          <div onClick={this.setActive} className={styles.cardHeader_textSettings}>
            Settings
          </div>
          <Modal
            active={this.state.active}
            onEscKeyDown={this.setActive}
            onOverlayClick={this.setActive}
            className={styles.modal}
          >
            <ComposePost
              socialPreview={socialPreview}
              headerTabs={headerTabs}
            />
          </Modal>
        </CardHeader>
        <div className={styles.reviewsComments}>
          <div className={styles.reviewsComments__container} >
            <Col xs={12} className={styles.reviewsComments__comment} >
              {data.map((obj, i) => (
                <BigCommentBubble
                  key={i}
                  icon={obj.icon}
                  iconColor={obj.iconColor}
                  background={obj.background}
                  iconAlign={obj.iconAlign}
                  headerLinkName={obj.headerLinkName}
                  headerLinkSite={obj.headerLinkSite}
                  siteStars={obj.siteStars}
                  siteTitle={obj.siteTitle}
                  sitePreview={obj.sitePreview}
                  createdAt={obj.createdAt}
                  comments={obj.comments}
                  doubleIcon={obj.doubleIcon}
                  actions={obj.actions}
                  requiredAction={obj.requiredAction}
                />
              ))}
            </Col>
          </div>
        </div>
      </Card>
    );
  }
}

ReviewsCard.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
export default ReviewsCard;


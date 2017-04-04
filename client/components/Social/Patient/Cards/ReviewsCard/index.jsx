import React, { PropTypes, Component} from 'react';
import { Card, CardHeader, BigCommentBubble, Col } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

class ReviewsCard extends Component {
  constructor(props) {
    super(props);
    this.togglePost = this.togglePost.bind(this);
  }
  togglePost(e) {
    console.log(e.target);
  }
  render() {
    const {data} = this.props;
    return (
      <Card borderColor={colorMap.blue} className={styles.card}>
        <CardHeader
          className={styles.cardHeader}
          title={'REVIEWS'}>
          <div onClick={this.togglePost}>
            Compose
          </div>
        </CardHeader>
        <div className={styles.reviewsComments}>
          <div className={styles.reviewsComments__container} >
            <Col xs={12} className={styles.reviewsComments__comment} >
              {data.map(obj => (
                <BigCommentBubble
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


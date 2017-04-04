import React, { PropTypes } from 'react';
import { Card, CardHeader, BigCommentBubble, Col } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function ReviewsCard(props) {
  const {
    data,
  } = props;

  return (
    <Card borderColor={colorMap.blue} className={styles.card}>
      <CardHeader className={styles.cardHeader} title={'REVIEWS'} />
      <div className={styles.reviewsComments}>
        <div className={styles.reviewsComments__container} >
          <Col xs={12} md={12} className={styles.reviewsComments__comment} >
            {data.map((obj) => {
              return (
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
              );
            })}
          </Col>
        </div>
      </div>
    </Card>
  );
}

ReviewsCard.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

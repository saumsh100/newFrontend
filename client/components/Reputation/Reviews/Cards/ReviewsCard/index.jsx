import React, { PropTypes } from 'react';
import { Card, CardHeader, BigCommentBubble, Col } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

const companyIcons = {
  'Rate MDs': '//www.cdnstyles.com/static/images/icon32/sourceId-10450.png',
  'Facebook': '//www.cdnstyles.com/static/images/icon32/sourceId-10050.png',
  'Yelp': '//www.cdnstyles.com/static/images/icon32/sourceId-10000.png',
  'Google Maps': '//www.cdnstyles.com/static/images/icon32/sourceId-10010.png',
};

export default function ReviewsCard(props) {
  const {
    data,
  } = props;

  return (
    <Card  className={styles.card}>
      <CardHeader className={styles.reviewsComments__cardHeader} title={'REVIEWS'} />
      <div className={styles.reviewsComments}>
        <div className={styles.reviewsComments__container} >
          <Col xs={12} md={12} className={styles.reviewsComments__comment} >
            {data.length ? data.map((obj, i) => {
              return (
                <BigCommentBubble
                  key={i}
                  icon={companyIcons[obj.icon]}
                  iconColor={obj.iconColor}
                  background={obj.background}
                  iconAlign={obj.iconAlign}
                  headerLinkName={obj.headerLinkName}
                  headerLinkSite={obj.headerLinkSite}
                  siteStars={obj.siteStars}
                  siteTitle={obj.siteTitle}
                  sitePreview={obj.sitePreview}
                  createdAt={obj.createdAt}
                  requiredAction={obj.requiredAction}
                  url={obj.url}
                  reviewerUrl={obj.reviewerUrl}
                />
              );
            }) : <div>&nbsp;</div>}
          </Col>
        </div>
      </div>
    </Card>
  );
}

ReviewsCard.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

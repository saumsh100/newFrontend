import React, { PropTypes } from 'react';
import { Card, CardHeader, BigCommentBubble, Col, Button, Icon } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';
import DateRangeReviews from './DateRangeReviews';

const companyIcons = {
  'Rate MDs': '//www.cdnstyles.com/static/images/icon32/sourceId-10450.png',
  'Facebook': '//www.cdnstyles.com/static/images/icon32/sourceId-10050.png',
  'Yelp': '//www.cdnstyles.com/static/images/icon32/sourceId-10000.png',
  'Google Maps': '//www.cdnstyles.com/static/images/icon32/sourceId-10010.png',
};

export default function ReviewsCard(props) {
  const {
    data,
    startDate,
    endDate,
    submitDate,
  } = props;

  const UserMenu = props => (
    <Button flat {...props} className={styles.dateRangeContainer}>
      <span><i className="fa fa-calendar" /> </span>
      <span className={styles.dateRangeContainer_date}>{startDate.format('MMM Do YYYY')} - {endDate.format('MMM Do YYYY')}</span>
      <span><Icon icon="caret-down" /></span>
    </Button>
  );

  const initialValues = {
    endDate: endDate._d,
    startDate: startDate._d,
  };

  return (
    <Card className={styles.card}>
      <CardHeader count={data.length} className={styles.reviewsComments__cardHeader} title={'REVIEWS'} >
        <DateRangeReviews UserMenu={UserMenu} submitDate={submitDate} initialValues={initialValues} />
      </CardHeader>
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
            }) : <div className={styles.clearedReviews}>Please Select a Filter Option or Increase the Date Range.</div>}
          </Col>
        </div>
      </div>
    </Card>
  );
}

ReviewsCard.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

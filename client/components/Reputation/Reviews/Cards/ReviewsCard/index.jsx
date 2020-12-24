
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, BigCommentBubble, Col, Button, DialogBox } from '../../../../library';
import content from '../../howToContent';
import styles from '../../styles.scss';

const awsUri =
  process.env.NODE_ENV === 'production'
    ? 'https://production-carecru-assets.s3.ca-central-1.amazonaws.com/img/logos'
    : 'https://preproduction-carecru-assets.s3.ca-central-1.amazonaws.com/img/logos';

const companyIcons = {
  'Rate MDs': `${awsUri}/ratemds38w.png`,
  Facebook: `${awsUri}/facebook38w.png`,
  Yelp: `${awsUri}/yelp38w.png`,
  Google: `${awsUri}/google38w.png`,
  CareCru: `${awsUri}/carecru38w.png`,
  YellowPages: `${awsUri}/yellow-pages38w.png`,
};

const capitalize = (str) => {
  const firstLetter = str[0];
  const rest = str.slice(1, str.length);
  return `${firstLetter.toUpperCase()}${rest}`;
};

const isCareCruReview = r => r.icon === 'CareCru';

/**
 * [nonCareCruReviewsCount returns the total count of reviews minus reviews done by CareCru]
 * @param nonCCReviews
 * @param ccReviews
 */
const nonCareCruReviewsCount = (nonCCReviews, ccReviews) => nonCCReviews - ccReviews;

class ReviewsCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHowToActive: false,
      sentiment: 'positive',
    };

    this.toggleHowTo = this.toggleHowTo.bind(this);
  }

  toggleHowTo(sentiment = 'positive') {
    this.setState({
      isHowToActive: !this.state.isHowToActive,
      sentiment,
    });
  }

  render() {
    const { data, reviewsContainerHeight } = this.props;
    const careCruReviews = data.filter(isCareCruReview);
    const ccLength = careCruReviews.length;

    const maxHeight = {
      maxHeight: `${reviewsContainerHeight - 240}px`,
      marginBottom: '15px',
    };

    return (
      <Card className={styles.card}>
        <CardHeader
          count={nonCareCruReviewsCount(data.length, ccLength)}
          className={styles.reviewsComments__cardHeader}
          title="REVIEWS"
        >
          <div className={styles.ccReviews}>
            {`${ccLength} CARECRU REVIEW${ccLength === 1 ? '' : 'S'}`}
          </div>
        </CardHeader>
        <div className={styles.reviewsComments} style={maxHeight}>
          <div className={styles.reviewsComments__container}>
            <Col xs={12} md={12} className={styles.reviewsComments__comment}>
              {data.length ? (
                data.map((obj) => {
                  const isCC = isCareCruReview(obj);
                  return (
                    <BigCommentBubble
                      key={`${obj.reviewId}_reviewBubble`}
                      sourceName={obj.icon}
                      icon={companyIcons[obj.icon]}
                      iconColor={obj.iconColor}
                      background={false}
                      iconAlign={obj.iconAlign}
                      headerLinkName={obj.headerLinkName}
                      headerLinkSite={obj.headerLinkSite}
                      siteStars={obj.siteStars}
                      siteTitle={obj.siteTitle}
                      sitePreview={obj.sitePreview}
                      createdAt={obj.publishedDate}
                      requiredAction={!isCC && obj.requiredAction}
                      url={obj.url}
                      reviewerUrl={obj.reviewerUrl}
                      onClickHowTo={this.toggleHowTo}
                    />
                  );
                })
              ) : (
                <div className={styles.clearedReviews}>Please Remove a Filter Option.</div>
              )}
            </Col>
          </div>
        </div>
        <DialogBox
          onOverlayClick={() => this.toggleHowTo()}
          active={this.state.isHowToActive}
          title={`How to Respond to ${capitalize(this.state.sentiment)} Reviews`}
          actions={[
            {
              props: { border: 'blue' },
              component: Button,
              onClick: () => this.toggleHowTo(),
              label: 'Close',
            },
          ]}
        >
          {content[this.state.sentiment].content}
        </DialogBox>
      </Card>
    );
  }
}

ReviewsCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  reviewsContainerHeight: PropTypes.number,
};

ReviewsCard.defaultProps = { reviewsContainerHeight: null };
export default ReviewsCard;

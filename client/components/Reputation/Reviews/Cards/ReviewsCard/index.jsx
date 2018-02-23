
import React, { Component, PropTypes } from 'react';
import {
  Card,
  CardHeader,
  BigCommentBubble,
  Col,
  Button,
  Icon,
  DialogBox,
} from '../../../../library';
import content from '../../howToContent';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';
import DateRangeReviews from './DateRangeReviews';

const companyIcons = {
  'Rate MDs': '//www.cdnstyles.com/static/images/icon32/sourceId-10450.png',
  'Facebook': '//www.cdnstyles.com/static/images/icon32/sourceId-10050.png',
  'Yelp': '//www.cdnstyles.com/static/images/icon32/sourceId-10000.png',
  'Google Maps': '//www.cdnstyles.com/static/images/icon32/sourceId-10010.png',
  'CareCru': 'https://carecru.com/wp-content/uploads/2017/07/cropped-CareCru-Icon.png',
};

const capitalize = (str) => {
  const firstLetter = str[0];
  const rest = str.slice(1, str.length);
  return `${firstLetter.toUpperCase()}${rest}`;
};

const isCareCruReview = r => r.icon === 'CareCru';

export default class ReviewsCard extends Component {
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
    const {
      data,
      startDate,
      endDate,
      submitDate,
    } = this.props;

    const careCruReviews = data.filter(isCareCruReview);
    const ccLength = careCruReviews.length;

    const UserMenu = props => (
      <Button flat {...props} className={styles.dateRangeContainer}>
        <span><i className="fa fa-calendar"/> </span>
        <span className={styles.dateRangeContainer_date}>{startDate.format('MMM Do YYYY')}
          - {endDate.format('MMM Do YYYY')}</span>
        <span><Icon icon="caret-down"/></span>
      </Button>
    );

    const initialValues = {
      endDate,
      startDate,
    };

    return (
      <Card className={styles.card}>
        <CardHeader count={data.length - ccLength} className={styles.reviewsComments__cardHeader} title={'REVIEWS'}>
          <div className={styles.ccReviews}>
            {`${ccLength} CARECRU REVIEW${ccLength === 1 ? '' : 'S'}`}
          </div>
        </CardHeader>
        <div className={styles.reviewsComments}>
          <div className={styles.reviewsComments__container}>
            <Col xs={12} md={12} className={styles.reviewsComments__comment}>
              {data.length ? data.map((obj, i) => {
                const isCC = isCareCruReview(obj);
                return (
                  <BigCommentBubble
                    key={`${i}_reviewBubble`}
                    sourceName={obj.icon}
                    icon={companyIcons[obj.icon]}
                    iconColor={obj.iconColor}
                    background={obj.background}
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
              }) : <div className={styles.clearedReviews}>Please Remove a Filter Option or Increase the Date Range.</div>}
            </Col>
          </div>
        </div>
        <DialogBox
          onOverlayClick={() => this.toggleHowTo()}
          active={this.state.isHowToActive}
          title={`How to Respond to ${capitalize(this.state.sentiment)} Reviews`}
          actions={[{
            props: { border: 'blue' },
            component: Button,
            onClick: () => this.toggleHowTo(),
            label: 'Close',
          }]}
        >
          {content[this.state.sentiment].content}
        </DialogBox>
      </Card>
    );
  }
}

ReviewsCard.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

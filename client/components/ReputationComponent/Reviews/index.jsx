import React, { PropTypes, Component } from 'react';
import { Card, Col, Grid, Row, CardHeader, Star, Tag, BigCommentBubble, Checkbox } from '../../library';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';
import _ from 'lodash';
import moment from 'moment'

class Reviews extends Component {
  render() {

    const rating = {
      5: 11,
      4: 0,
      3: 0,
      2: 0,
      1: 1,
    }

    const ratingStars = _.keys(rating).sort((a,b) => a > b);
    const maxValue = _.max(_.values(rating));

    const DataBigComment = [{
      icon: "facebook",
      iconColor: '#ffffff',
      background: '#395998',
      iconAlign: 'flex-end',
      headerLinkName: "S. Lalala",
      headerLinkSite: "yelp.ca",
      siteStars: 4,
      siteTitle: "Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.",
      sitePreview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: moment().subtract(10, 'days').fromNow()
    },{
      icon: "bitcoin",
      iconColor: '#ffffff',
      background: '#ffc55b',
      iconAlign: 'center',
      headerLinkName: "L. Linda",
      headerLinkSite: "yelp.ca",
      siteStars: 6,
      siteTitle: "Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.",
      sitePreview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: moment().subtract(10, 'days').fromNow()
    },{
      icon: "twitter",
      iconColor: '#ffffff',
      background: '#FF715A',
      iconAlign: 'center',
      headerLinkName: "N. Blabla",
      headerLinkSite: "yelp.ca",
      siteStars: 3,
      siteTitle: "Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.",
      sitePreview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: moment().subtract(10, 'days').fromNow()
    }];
   

    return (
      <Grid className={styles.reviews}>
        <Row>
          <Col className={styles.padding} xs={12} md={12}>
            <Card borderColor={colorMap.red} className={styles.card}>
              <div className={styles.googleMapsRespond}>
                <div className={styles.googleMapsRespond__video}>
                  <iframe width="250" height="120"
                  src="https://www.youtube.com/watch?v=t13DULDt01k">
                  </iframe>
                </div>
                <div className={styles.googleMapsRespond__descr}>
                  <div> Respond to google maps review </div>
                  <div> You can respond from here! Connect your Google My Busyness account to get started </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} >4.7</span>
                <span className={styles.stats__title} >Average Rating</span>
                <div className={styles.stats__rating}>
                  <Star size={1.3} />
                  <Star size={1.3} />
                </div>
                <span className={styles.stats__bottom}>Industry Average 4.1/5</span>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} >12</span>
                <span className={styles.stats__title} >Average Rating</span>
                <div className={styles.stats__rating}>
                  0 With no start rating
                </div>
                <span className={styles.stats__bottom}>Industry Average 106</span>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                  {ratingStars.map(r => {
                    const rows = [];
                    for(let i = 1; i <= r; i++ ) {
                      rows.push(<Star size={1.3} />);
                    }
                    const width = rating[r] ? (Math.floor((rating[r] / maxValue) * 80)) : 5;
                    const style = { width: `${width}%` };
                    return (
                      <div className={styles.content}>
                        <div className={styles.content__stars}>
                          {rows}
                        </div>

                        <div className={styles.content__bar}>
                          <span
                            style={style}
                            className={styles.content__bar__percent}>
                          </span>
                          {rating[r]}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={12}>
            <Card borderColor={colorMap.yellow} className={styles.card}>
              <div className={styles.tags}>
                <div className={styles.tags__left}>
                  <Tag label="dentist" color={colorMap.blue}  />
                  <Tag label="dentist vancouver" color={colorMap.red} />
                  <Tag label="dentist kitsilano" color={colorMap.yellow} />
                  <Tag label="dentist hygienist" color={colorMap.green} />
                  <span className={styles.tags__left__update}>Update keyword based on filters</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={12} sm={7} lg={7}>
            <Card borderColor={colorMap.blue} className={styles.card}>
              <CardHeader className={styles.cardHeader} title={'REVIEWS'} />
                <div className={styles.reviewsComments}>
                  <div className={styles.reviewsComments__container} >

                    <Col xs={12} md={12} className={styles.reviewsComments__comment} >
                      {DataBigComment.map(obj => {
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
                            createdAt={obj.createdAt}/>
                        )
                      })}
                    </Col>
                  </div>
                </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={5} lg={5}>
            <Card borderColor={colorMap.red} className={styles.card}>
              <div className={styles.filters}>
                <div className={styles.filters__header}>
                  <div className={styles.filters__header__left}>
                    <span>Filters</span>
                    <span className="fa fa-sliders"></span>
                  </div>
                  <div className={styles.filters__header__right}>
                    <span>Select All</span>
                    <span>Clear All</span>
                  </div>
                </div>
                <div className={styles.filters__search}>
                  <span className="fa fa-search" ></span>
                  <input type="text" placeholder="Search..."/>
                </div>
                <div className={styles.filters__title}>Date Range</div>
                <div className={styles.filters__selectFilter}>
                  <select>
                    <option selected value="option1">Select date range</option>
                    <option value="option2">option1</option>
                    <option value="option3">option2</option>
                    <option value="option4">option3</option>
                    <option value="option5">option4</option>
                  </select>
                </div>
                <div className={styles.filters__title}>Sources</div>
                <div className={styles.filters__checkFilter}>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>Google maps (5)</span>
                    <span><Checkbox /></span>
                  </div>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>Yelp (3)</span>
                    <span><Checkbox /></span>
                  </div>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>Facebook (3)</span>
                    <span><Checkbox /></span>
                  </div>
                </div>
                <div className={styles.filters__title}>Rating</div>
                <div className={styles.filters__checkFilter}>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>1 Star</span>
                    <span><Checkbox /></span>
                  </div>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>2 Star</span>
                    <span><Checkbox /></span>
                  </div>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>3 Star</span>
                    <span><Checkbox /></span>
                  </div>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>4 Star</span>
                    <span><Checkbox /></span>
                  </div>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>5 Star</span>
                    <span><Checkbox /></span>
                  </div>
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>No Rating</span>
                    <span><Checkbox /></span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Reviews;

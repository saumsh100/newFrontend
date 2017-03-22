import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from 'moment';
import RequestsContainer from "../../containers/RequestContainer";
import fetchReputationData from "../../thunks/fetchReputationData";
import fetchReviewsData from "../../thunks/fetchReviewsData";
import { Grid, Row, Col, Card, CardHeader, DashboardStats, BigCommentBubble  } from "../library";
import RemindersList from "./RemindersList";
import colorMap from "../library/util/colorMap";
import styles from "./styles.scss";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.fetchReputationData();
    // this.props.fetchReviewsData();
  }

  renderCards() {
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
    const DataRemindersList = [{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "24",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/2000",
      time: "18:00pm",
      icon: "phone"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "envelope"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "envelope"
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "19",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "phone"
    }];
    const DataRemindersList2 = [{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/practitioner_1.png",
      name: "Issac Item",
      age: "2",
      phone: "123 456 7890",
      email: "eeeeeeee@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    }];
    const {
      listingCount,
      errorCount,
      missingCount,
      lastFetchedListings,
      statusListings,
      fetchReputationData,
      statusReviews,
      lastFetchedReviews,
      fetchReviewsData,
      ratingCounts,
    } = this.props;


    const data = [
      {count: 12, title: "Appointment Booked", icon: "calendar", size: 10, color: 'primaryColor' },
      {count: 64, title: "Appointment Booked", icon: "user", size: 10, color: 'primaryBlue' },
      {count: 16, title: "Appointment Booked", icon: "bullhorn", size: 10, color: 'primaryGreen' },
      {count: 23, title: "Appointment Booked", icon: "star", size: 10, color: 'primaryYellow' },
    ];


    return (
      <Grid className={styles.dashboard}>
        <Row>
          <Col className={styles.dashboard__header} xs={12}>
            <Card className={styles.dashboard__header_title}>
              Welcome Back, <b>Corina</b>
            </Card>
            <DashboardStats data={data} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} >
            <Row center="xs"  className={styles.dashboard__patientList}>
              <Col className={styles.dashboard__patientList_item} xs={12} sm={6} md={4}>
                <RemindersList data={DataRemindersList}
                               borderColor={colorMap.blue}
                               cardCount="8"
                               cardTitle="Reminders" />
              </Col>
              <Col className={styles.dashboard__patientList_item} xs={12} sm={6} md={4}>
                <RemindersList data={DataRemindersList}
                               borderColor={colorMap.blue}
                               cardCount="2"
                               cardTitle="Recalls" />
              </Col>
              <Col className={styles.dashboard__patientList_item} xs={12} sm={6} md={4}>
                <RemindersList data={DataRemindersList2}
                               borderColor={colorMap.blue}
                               cardCount="5"
                               cardTitle="Digital Waitlist" />
              </Col>
            </Row>
          </Col>
          <Col className={styles.padding} xs={12} md={8}>
            <Card borderColor={colorMap.green}>
              <CardHeader className={styles.cardHeader} title="Unresponded Reviews" count={16}/>
              <div styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                <div styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Col xs={12} md={12}>
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
          <Col xs={12} sm={4} className={styles.dashboard__requestContainer}>
            <RequestsContainer />
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {
    return (
      <div>
        {this.renderCards()}
      </div>
    );
  }
}

function mapStateToProps({ reputation, reviews }) {
  return {
    lastFetchedListings: reputation.get('lastFetched'),
    statusListings: reputation.get('status'),
    listingCount: reputation.getIn(['data', 'sourcesFound']),
    errorCount: reputation.getIn(['data', 'sourcesFoundWithErrors']),
    missingCount: reputation.getIn(['data', 'sourcesNotFound']),

    statusReviews: reviews.get('status'),
    lastFetchedReviews: reviews.get('lastFetched'),
    ratingCounts: reviews.getIn(['data', 'ratingCounts'])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchReputationData,
    fetchReviewsData,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);

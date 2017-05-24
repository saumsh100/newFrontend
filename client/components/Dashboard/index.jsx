
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import RequestsContainer from '../../containers/RequestContainer';
import fetchReputationData from '../../thunks/fetchReputationData';
import fetchReviewsData from '../../thunks/fetchReviewsData';
import {
  Grid,
  Row,
  Col,
  Card,
  CardHeader,
  DashboardStats,
  BigCommentBubble,
} from '../library';
import RemindersList from './Cards/RemindersList';
import DigitalWaitList from './Cards/DigitalWaitList';
import Table from './Cards/Table';
import Referrals from './Cards/Referrals';
import colorMap from '../library/util/colorMap';
import styles from './styles.scss';

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
      img: "images/patient_1.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      icon: "comment"
    },{
      img: "images/patient_2.png",
      name: "Tesha Ferrer",
      age: "24",
      phone: "123 456 7890",
      email: "Darrel_Rodriguez29@hotmail.com",
      status: "Seminder Sent",
      date: "22/11/2000",
      time: "18:00pm",
      icon: "phone"
    },{
      img: "images/patient_3.png",
      name: "Ernestina Munsterman",
      age: "19",
      phone: "123 456 7890",
      email: "Ressie30@hotmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "envelope"
    },{
      img: "images/patient_4.png",
      name: "Bryan Simek",
      age: "33",
      phone: "123 456 7890",
      email: "Amya.Turner63@hotmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "comment"
    },{
      img: "images/patient_5.png",
      name: "Astrid Spady",
      age: "19",
      phone: "123 456 7890",
      email: "Kaia81@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "phone"
    }];
    const DataRemindersList2 = [{
      img: "images/patient_6.png",
      name: "Isabel Stapleton",
      age: "11",
      phone: "123 456 7890",
      email: "Maria_Predovic@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/patient_7.png",
      name: "Mathilde Heft",
      age: "2",
      phone: "123 456 7890",
      email: "Asia.Nikolaus@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/patient_8.png",
      name: "Brock Lundblad",
      age: "26",
      phone: "123 456 7890",
      email: "Macie4@hotmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/patient_9.png",
      name: "Candie Shubert",
      age: "27",
      phone: "123 456 7890",
      email: "Ayla.Heller68@gmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/patient_10.png",
      name: "Diana Shisler",
      age: "10",
      phone: "123 456 7890",
      email: "Narciso.Will@hotmail.com",
      status: "Seminder Sent",
      date: "22/11/1988",
      time: "4:00pm",
      appointment: {
        days: [ "Morning weekdays", "Arternoon"  ],
        except: [ moment()._d, moment()._d ]
      }
    },{
      img: "images/patient_5.png",
      name: "Astrid Spady",
      age: "19",
      phone: "123 456 7890",
      email: "Kaia81@gmail.com",
      status: "Seminder Sent",
      date: "01/13/1988",
      time: "6:32pm",
      icon: "phone"
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
      {count: 10, title: "Appointment Booked", icon: "calendar", size: 6, color: 'primaryColor' },
      {count: 12, title: "New Appt Request", icon: "user", size: 6, color: 'primaryBlue' },
      {count: 13, title: "Unconfirmed Refferals", icon: "bullhorn", size: 6, color: 'primaryGreen' },
      {count: 16, title: "Unresponded Reviews", icon: "star", size: 6, color: 'primaryYellow' },
    ];

    const hardcodedReferralData = [{
      img: "images/patient_1.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },{
      img: "images/patient_2.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },{
      img: "images/patient_3.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },{
      img: "images/patient_4.png",
      name: "Bobby Okelley",
      age: "53",
      phone: "123 456 7890",
      email: "Monroe_Jacobs@gmail.com",
      from: "Seminder Sent",
      date: "22/11",
    },];


    return (
      <Grid className={styles.dashboard}>
        <Row className={styles.dashboard__header}>
          <Col xs={12} >
            <Card className={styles.dashboard__header_title}>
              Welcome Back, <b>Justin</b>
            </Card>
          </Col>
        </Row>
        <Row className={styles.dashboard__body}>
          <Col xs={12}>
            <DashboardStats data={data} />
          </Col>
          <Col className={styles.padding}
               xs={12} md={8}>
            <Table className={styles.dashboard__body_table}
                   borderColor={colorMap.grey}
                   cardCount="7"
                   cardTitle="Phone / SMS / Email"/>
          </Col>
          <Col className={styles.padding}
               xs={12}  md={4}>
            <RequestsContainer className={styles.dashboard__body_request}
                               borderColor={colorMap.darkblue}/>
          </Col>
          <Col className={styles.padding}
               xs={12} md={8}>
            <Card className={styles.dashboard__body_comments} >
              <CardHeader className={styles.cardHeader} title="Unresponded Reviews" count={16}/>
              <div className={styles.underspondedReviews}>
                <div className={styles.underspondedReviews__mainContainer}>
                  <Col xs={12} md={12} className={styles.underspondedReviews__comment} >
                    {DataBigComment.map((obj, index) => {
                      return (
                        <BigCommentBubble
                          key={index}
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
          <Col
            className={styles.padding}
            xs={12}
            md={4}
          >
            <Referrals
              className={styles.dashboard__body_table}
              data={hardcodedReferralData}
              cardTitle="Unconfirmed Referrals"
            />
          </Col>
          <Col xs={12}>
            <Row center="xs" className={styles.dashboard__patientList}>
              <Col className={styles.dashboard__patientList_item} xs={12} md={6} lg={4}>
                <RemindersList
                  key="Reminders"
                  data={DataRemindersList}
                  cardTitle="Reminders"
                />
              </Col>
              <Col  className={styles.dashboard__patientList_item} xs={12} md={6} lg={4}>
                <RemindersList
                  key="Recalls"
                  data={DataRemindersList}
                  cardTitle="Recalls"
                />
              </Col>
              <Col className={styles.dashboard__patientList_item} xs={12} md={12} lg={4}>
                <DigitalWaitList />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {
    return (
      <div className={styles.dashboardContainer}>
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

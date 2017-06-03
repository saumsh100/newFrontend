
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import RequestsContainer from '../../containers/RequestContainer';
import { push } from 'react-router-redux';
import { fetchEntities } from '../../thunks/fetchEntities';
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
import RecallsList from './Cards/RecallsList';
import DigitalWaitList from '../DigitalWaitList';
import * as Actions from '../../actions/patientList';
import styles from './styles.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const currentDate = moment();

    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const query = {
      startDate,
      endDate,
      limit: 100,
    };

    Promise.all([
      this.props.fetchEntities({ key: 'appointments', params: query }),
      this.props.fetchEntities({ key: 'requests' }),
      this.props.fetchEntities({ key: 'sentReminders', join: ['reminder', 'appointment', 'patient'] }),
      this.props.fetchEntities({ key: 'sentRecalls', join: ['recall', 'patient'] }),
    ]).then(() => {
      this.setState({ loaded: true });
    }).catch(e => console.log(e));

  }

  renderCards() {
    const {
      appointments,
      requests,
      reminders,
      patients,
      sentReminders,
      setSelectedPatientId,
      push,
      recalls,
      sentRecalls,
    } = this.props;

    const today = moment();

    const appointmentCount = appointments.toArray().filter((app) => {
      const sDate = moment(app.startDate);
      const isSameDate = today.isSame(sDate, 'day');
      return (isSameDate && !app.isDeleted);
    });
    const filterConfirmedRequests = requests.toArray().filter((req) => !req.get('isCancelled'));

    const data = [
      {count: appointmentCount.length, title: "Appointments Today", icon: "calendar", size: 6, color: 'primaryColor' },
      {count: filterConfirmedRequests.length, title: "New Appt Request", icon: "user", size: 6, color: 'primaryBlue' },
      {count: sentReminders.size, title: "Reminders", icon: "bullhorn", size: 6, color: 'primaryGreen' },
      {count: sentRecalls.size, title: "Recalls", icon: "star", size: 6, color: 'primaryYellow' },
    ];

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
          <Col className={styles.dashboard__patientList_item} xs={12} md={12} lg={6}>
            <DigitalWaitList />
          </Col>
          <Col className={styles.padding} xs={12}  md={12} lg={6}>
            <div className={styles.dashboard__body_request}>
              <RequestsContainer
                key="dashBoardRequests"
              />
            </div>
          </Col>
          {/*
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
          */}
          <Col xs={12}>
            <Row center="xs" className={styles.dashboard__patientList}>
              <Col className={styles.dashboard__patientList_item} xs={12} md={6} lg={6}>
                <RecallsList
                  patients={patients}
                  recalls={recalls}
                  sentRecalls={sentRecalls}
                  setSelectedPatientId={setSelectedPatientId}
                  push={push}
                />
              </Col>
              <Col className={styles.dashboard__patientList_item} xs={12} md={6} lg={6}>
                <RemindersList
                  patients={patients}
                  appointments={appointments}
                  reminders={reminders}
                  sentReminders={sentReminders}
                  setSelectedPatientId={setSelectedPatientId}
                  push={push}
                />
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

function mapStateToProps({ entities }) {
  return {
    requests: entities.getIn(['requests', 'models']),
    appointments: entities.getIn(['appointments', 'models']),
    patients: entities.getIn(['patients', 'models']),
    reminders: entities.getIn(['reminders', 'models']),
    sentReminders: entities.getIn(['sentReminders', 'models']),
    recalls: entities.getIn(['recalls', 'models']),
    sentRecalls: entities.getIn(['sentRecalls', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    push,
    setSelectedPatientId: Actions.setSelectedPatientIdAction,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);

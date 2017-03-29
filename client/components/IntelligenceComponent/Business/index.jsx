import React, { PropTypes, Component } from "react";
import { Card, Col, Grid, Row, ContainerList} from "../../library";
import colorMap from "../../library/util/colorMap";
import classNames from 'classnames';
import moment from 'moment';
import BusinessStats from './BusinessStats';
import DataStats from './DataStats';
import Patients from './Patients';
import styles from "./styles.scss";

class Business extends Component {
  render() {
    const data = [
      {percentage: 12, question: true, count: 353, title: "All Calls", icon: "phone", color: 'primaryColor' },
      {percentage: 12, question: true, count: 243, title: "Pickups", icon: "user", color: 'primaryBlue' },
      {percentage: 12, question: true, count: 102, title: "Bookings", icon: "calendar-o", color: 'primaryGreen' },];

    const tabStep = [{label: "Online Booking", data: {count: 353, title: "Website Visits", icon: "television", color: 'primaryColor' }},
      {label: "Calls From Website", data: {count: 102, title: "Online Booking", icon: "users", color: 'primaryColor' }}, ];

    const patientsData = [
      {count: 5433, title: "Active Patients", date:  moment({year: 2017, month: 2, day: 15}).fromNow(), color: 'primaryColor' },
      {count: 39, title: "New Patients", date:  moment({year: 2017, month: 1, day: 15}).fromNow(), color: 'primaryBlue' },
      {count: 1746, title: "Patients with Hygiene Appts", date:  moment({year: 2016, month: 10, day: 10}).fromNow(), color: 'primaryGreen' },
      {count: "$288", title: "Average Hourly Production", date:  moment({year: 2015, month: 6, day: 15}).fromNow(), color: 'primaryGreen' },];
    return (
      <Grid className={styles.business}>
        <Row>
          <Col className={styles.business__header} xs={12}>
            <Card className={styles.business__header_title}>
              <b>Business</b>
            </Card>
          </Col>
          <Col className={styles.business__body} xs={12}>
            <Row>
              <Col xs={12}>
                <BusinessStats data={data} className={styles.business__body_arrows} />
              </Col>
              <Col xs={12}>
                <DataStats data={tabStep} borderColor={colorMap.red} className={styles.business__body_call} />
              </Col>
              <Col xs={12}>
                <Patients data={patientsData} borderColor={colorMap.green} className={styles.business__body_call} />
              </Col>
              <Col xs={12} sm={6}>
                <ContainerList borderColor={colorMap.darkblue}
                               cardTitle="Procedure by Hours"
                               data={[{
                                 title: "Invisalign",
                                 data: 123,
                               },{
                                 title: "Teeth Whitening",
                                 data: 123,
                               },{
                                 title: "Regular Checkup",
                                 data: 123,
                               },{
                                 title: "Lost Fillings",
                                 data: 123,
                               },{
                                 title: "Emergency Appointments",
                                 data: 123,
                               }]} />
              </Col>
              <Col xs={12} sm={6}>
                <ContainerList borderColor={colorMap.darkblue}
                               cardTitle="Procedure by Production"
                               data={[{
                                 title: "Invisalign",
                                 hours: "33,487"
                               },{
                                 title: "Teeth Whitening",
                                 hours: "3,617"
                               },{
                                 title: "Regular Checkup",
                                 hours: "1,901"
                               },{
                                 title: "Lost Fillings",
                                 hours: "13,717"
                               },{
                                 title: "Emergency Appointments",
                                 hours: "33,487"
                               }]} />
              </Col>
              <Col xs={12}>
                <Patients data={patientsData} borderColor={colorMap.blue} className={styles.business__body_call} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Business;

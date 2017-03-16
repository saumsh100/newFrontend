import React, { Component } from 'react';
import { Row, Col, Card, Guage  } from '../../library';
import styles from './styles.scss';


class PractitionersList extends Component {
  render() {
    const hardcodeData = [{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 80,
    },{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 46,
    },{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 21,
    },{
      img: "images/practitioner_1.png",
      name: "Dr. Chelsea",
      profession: "Hygienist",
      appointmentBooked: 77,
      appointmentNotFiltred: 83,
      newPatients: 12,
      percentage: 10,
    }];

    return (
      <Card className={styles.practitionerList}>
        <div className={styles.practitionerList__body}>
          <ul className={styles.practitioner}>
            <div className={styles.practitioner__wrapper}>
              <Row className={styles.practitioner__row}>
                {hardcodeData.map(obj => {
                  return (
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <li className={styles.practitioner__item}>
                        <div className={styles.practitioner__item_wrapper}>
                          <div className={styles.practitioner__item_header}>
                            <img className={styles.practitioner__item_img} src={obj.img} alt=""/>
                            <div className={styles.practitioner__item_about}>
                              <div className={styles.practitioner__item_name}>
                                <b>{obj.name}</b>
                              </div>
                              <div className={styles.practitioner__item_profession}>
                                {obj.profession}
                              </div>
                            </div>
                          </div>
                          <div className={styles.practitioner__item_footer}>
                            <div className={styles.practitioner__item_text}>
                              <span>Appointments Booked</span>
                              <span>{obj.appointmentBooked}</span>
                            </div>
                            <div className={styles.practitioner__item_text}>
                              <span>Appointments Not Filled</span>
                              <span>{obj.appointmentNotFiltred}</span>
                            </div>
                            <div className={styles.practitioner__item_text}>
                              <span>New Patients</span>
                              <span>{obj.newPatients}</span>
                            </div>
                          </div>
                          <Guage percentage={obj.percentage} width={100} height={100}/>
                        </div>
                      </li>
                    </Col>
                  )
                })}
              </Row>
            </div>

          </ul>
        </div>
      </Card>
    );
  }
}


export default PractitionersList;

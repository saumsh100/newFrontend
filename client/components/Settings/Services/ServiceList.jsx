import React, {Component, PropTypes, } from 'react';
import ServiceItem from './ServiceItem';
import { Card, CardHeader, List, Row, Col, IconButton} from '../../library';
import Modal  from '../../library/Modal';
import ServiceItemData from './ServiceItemData';

class ServiceList extends Component{

  constructor(props){
    super(props)


    this.state = {
      index: 0,
      active: false,
    }
    this.showService = this.showService.bind(this)
    this.submit = this.submit.bind(this);
    this.setActive = this.setActive.bind(this);
  }

  showService(index) {
    this.setState({index});
  }
  submit(values){
    console.log(values);
  }

  setActive() {
    let setActive = this.state.active;
    if(setActive){
      this.setState({active: false});
    }else{
      this.setState({active: true})
    }
  }

  render() {
    const { services } = this.props;
    return(
      <div>
        <Row>
        <Col xs={3}>
          <Row>
            <Col xs={2}>
              <IconButton icon="plus" onClick={this.setActive}/>
              <Modal active={this.state.active} onEscKeyDown={this.setActive} onOverlayClick={this.setActive}>
                <div>test</div>
              </Modal>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
                {services.toArray().map((service, index) => {
                  return(
                    <ServiceItem
                      key={service.get('id')}
                      index={index}
                      service={service.get('name')}
                      showService={this.showService}
                    />
                  );
                })}
            </Col>
          </Row>
        </Col>
        <Col xs={9}>
          {services.toArray().map((service, index) =>{
            if(index === this.state.index){
              return(
                <ServiceItemData
                  key={service.get('id')}
                  id={service.get('id')}
                  name={service.get('name')}
                  duration={service.get('duration')}
                  unitCost={service.get('unitCost')}
                  onSubmit={this.submit}
                />
              );
            }})}
          </Col>
        </Row>
      </div>
    );
  }
}




export default ServiceList;
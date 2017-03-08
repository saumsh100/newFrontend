import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ServiceItem from './ServiceItem';
import { Row, Col, IconButton} from '../../library';
import Modal  from '../../library/Modal';
import ServiceItemData from './ServiceItemData';
import CreateServiceForm from './CreateServiceForm';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../../thunks/fetchEntities';


class ServiceList extends Component{

  constructor(props){
    super(props);
    this.state = {
      index: 0,
      active: false,
    };
    this.showService = this.showService.bind(this)
    this.updateService = this.updateService.bind(this);
    this.setActive = this.setActive.bind(this);
    this.createService = this.createService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  showService(index) {
    this.setState({ index });
  }

  updateService(modifiedService) {
    this.props.updateEntityRequest({ key: 'services', model: modifiedService });
  }

  createService(values){
    values.customCosts = {};
    this.props.createEntityRequest({ key: 'services', entityData: values });
    this.setState({ active: false });
  }

  deleteService(id){
    this.props.deleteEntityRequest({ key: 'services', id });
  }

  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }


  render() {
    const { services } = this.props;
    return(
      <Row>
        <Col xs={3}>
          <Row>
            <Col xs={2}>
              <IconButton icon="plus" onClick={this.setActive} />
            </Col>
            <Modal
              active={this.state.active}
              onEscKeyDown={this.setActive}
              onOverlayClick={this.setActive}
            >
              <CreateServiceForm
                onSubmit={this.createService}
              />
            </Modal>
          </Row>
          <Row>
            <Col xs={12}>
              {services.toArray().map((service, index) => {
                return (
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
          {services.toArray().map((service, index) => {
            if(index === this.state.index) {
              return (
                <ServiceItemData
                  key={service.get('id')}
                  index={index}
                  service={service}
                  onSubmit={this.updateService}
                  deleteService={this.deleteService}
                />
              );
            }
            return null;
          })}
        </Col>
      </Row>
    );
  }
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    createEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);


export default enhance(ServiceList);
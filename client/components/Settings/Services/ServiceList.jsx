import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ServiceItem from './ServiceItem';
import { Row, Col, IconButton} from '../../library';
import Modal  from '../../library/Modal';
import ServiceItemData from './ServiceItemData';
import CreateServiceForm from './CreateServiceForm';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';

class ServiceList extends Component{

  constructor(props){
    super(props);
    this.state = {
      index: null,
      active: false,
    };
    this.showService = this.showService.bind(this)
    this.updateService = this.updateService.bind(this);
    this.setActive = this.setActive.bind(this);
    this.createService = this.createService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  createService(values){
    values.customCosts = {};
    this.props.createEntityRequest({ key: 'services', entityData: values });
    this.setState({ active: false });
  }

  updateService(modifiedService) {
    this.props.updateEntityRequest({ key: 'services', model: modifiedService });
  }

  deleteService(id){
    this.props.deleteEntityRequest({ key: 'services', id });
  }

  showService(index) {
    this.setState({ index });
  }

  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  render() {
    const { services } = this.props;
    return(
      <Row className={styles.servicesMainContainer} >
        <Col xs={3} className={styles.servicesListContainer}>
          <Row className={styles.modalContainer}>
            <IconButton
              icon="plus"
              onClick={this.setActive}
              className={styles.addServiceButton}
            />
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
                    index={service.get('id')}
                    service={service.get('name')}
                    showService={this.showService}
                  />
                );
              })}
            </Col>
          </Row>
        </Col>
        <Col xs={9} className={styles.servicesDataContainer}>
          {services.toArray().map((service, index) => {
            if(service.get('id') === this.state.index) {
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
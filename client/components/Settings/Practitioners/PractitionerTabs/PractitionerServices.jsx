import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import PractServicesList from './PractServicesList';
import { Form, Row, Col, Button } from '../../../library';


const sortServicesAlphabetical = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

function createInitialValues(serviceIds, services) {
  return services.map(s => {
    return serviceIds.indexOf(s.get('id')) > -1;
  }).toJS();
}

class PractitionerServices extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'services' });
  }

  handleSubmit(values) {
    const { practitioner, updatePractitioner } = this.props;
    const storeServiceIds = [];

    for (let id in values) {
      if (values[id]) {
        storeServiceIds.push(id);
      }
    }
    const modifiedPractitioner = practitioner.set('services', storeServiceIds);
    updatePractitioner(modifiedPractitioner);

  }

  render() {
    const { serviceIds, services, practitioner } = this.props;

    if (!practitioner) {
      return null;
    }

    let showComponent = null;

    if (services) {
      const filteredServices = services.sort(sortServicesAlphabetical);
      const initialValues = createInitialValues(serviceIds, services);

      showComponent = (
        <Form form={`${practitioner.get('id')}services`} onSubmit={this.handleSubmit} initialValues={initialValues}>
          {filteredServices.toArray().map((service, index) => {
            return (
              <PractServicesList
                key={`${practitioner.get('id')}${index}`}
                service={service}
              />
            );
          })}
        </Form>
      );
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }

}

function mapStateToProps({ entities }){
  return {
    services: entities.getIn(['services', 'models']),
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PractitionerServices);
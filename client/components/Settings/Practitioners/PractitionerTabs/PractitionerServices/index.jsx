import React, {Component, PropTypes} from 'react';
import { change } from 'redux-form';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../../../thunks/fetchEntities';
import PractServicesForm from './PractServicesForm';


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
    this.state = {
      allServices: false,
    }
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'services' });
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

      initialValues.allServices = this.state.allServices;

      showComponent = (
        <PractServicesForm
          services={filteredServices}
          initialValues={initialValues}
          change={this.props.change}
          practitioner={practitioner}
          updatePractitioner={this.props.updatePractitioner}
        />
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
    change,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PractitionerServices);

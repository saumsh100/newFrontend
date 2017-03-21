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


const arraysEqual = (arr1, arr2) => {
  if(arr1.length !== arr2.length)
    return false;
  for(let i = arr1.length; i--;) {
    if(arr1[i] !== arr2[i])
      return false;
  }
  return true;
}

class PractitionerServices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      setAllServices: false,
      serviceIds: [],
    }
    this.updateServiceIds = this.updateServiceIds.bind(this);
    this.setServices = this.setServices.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'services' });
    this.setState({ serviceIds: this.props.serviceIds });
  }

  updateServiceIds(id, option) {

    const tempArr = this.state.serviceIds;
    if (option === 'add') {
      this.setState({ serviceIds: tempArr.concat(id) });
    } else {
      const index = _.without(tempArr, id);
      this.setState({ serviceIds: index });
    }

  }

  setServices() {
    const {updateEntityRequest, practitioner} = this.props;
    const modifiedPractitioner = practitioner.set('services', this.state.serviceIds);
    updateEntityRequest({ key: 'practitioners', model: modifiedPractitioner });
  }

  render() {
    const { services, practitioner } = this.props;

    let showComponent = null;
    let disabled = arraysEqual(this.props.serviceIds, this.state.serviceIds);

    if (services) {
      const filteredServices = services.sort(sortServicesAlphabetical);
      showComponent = (
        filteredServices.toArray().map((service) => {
          return (
            <div>
                <PractServicesList
                  key={practitioner.get('id')}
                  service={service}
                  serviceIds={this.state.serviceIds}
                  setAllServices={this.state.setAllServices}
                  updateServiceIds={this.updateServiceIds}
                />
            </div>
          );
        }));
    }

    return (
      <div>
        {showComponent}
        <Button
          disabled={disabled}
          raised
          icon="floppy-o"
          onClick={this.setServices}
        >
          Save
        </Button>
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
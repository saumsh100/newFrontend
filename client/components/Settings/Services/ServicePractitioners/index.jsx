import React, {Component, PropTypes} from 'react';
import ServicesPractForm from './ServicesPractForm';

class ServicePractitioners extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { service, updateService } = this.props;
    const storePractitionerIds = [];

    for (let id in values) {
        if (values[id]) {
          storePractitionerIds.push(id);
        }
    }

    const alert = {
      success: `Practitioners updated for ${service.get('name')}.`,
      error: `Could not update practitioners for ${service.get('name')}.`,
    }
    const modifiedService = service.set('practitioners', storePractitionerIds);
    updateService(modifiedService, alert);
  }

  render() {
    const { service, practitioners, practitionerIds } = this.props;

    let showComponent = null;

    if (service) {
      const practitionerIds = service.get('practitioners');

      showComponent = (
        <ServicesPractForm
          key={`${service.get('id')}PractForm`}
          service={service}
          practitioners={practitioners}
          handleSubmit={this.handleSubmit}
          practitionerIds={practitionerIds}
          formName={`${service.get('id')}practitioners`}
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


export default ServicePractitioners;

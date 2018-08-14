
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ServicesPractForm from './ServicesPractForm';

class ServicePractitioners extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { service, updateService } = this.props;
    const storePractitionerIds = [];

    for (const id in values) {
      if (values[id]) {
        storePractitionerIds.push(id);
      }
    }

    const alert = {
      success: {
        body: `Practitioners updated for ${service.get('name')}.`,
      },
      error: {
        body: `Could not update practitioners for ${service.get('name')}.`,
      },
    };

    const modifiedService = service.set('practitioners', storePractitionerIds);
    updateService(modifiedService, alert);
  }

  render() {
    const { service, practitioners } = this.props;
    if (!service) return null;

    const practitionerIds = service.get('practitioners');

    return (
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
}

export default ServicePractitioners;

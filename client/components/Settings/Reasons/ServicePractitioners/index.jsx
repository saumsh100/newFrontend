import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import ServicesPractForm from './ServicesPractForm';
import Service from '../../../../entities/models/Service';

const ServicePractitioners = ({ service, updateService, practitioners, practitionerIds }) => {
  const [practitionerId, setpractitionerId] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      setpractitionerId(practitionerIds);
    }, 100);
  }, [practitionerIds]);
  
  const handleSubmit = (values) => {
    const alert = {
      success: {
        body: `Practitioners updated for ${service.get('name')}.`,
      },
      error: {
        body: `Could not update practitioners for ${service.get('name')}.`,
      },
    };

    const modifiedService = service.set('practitioners', values);
    updateService(modifiedService, alert);
  };

  return service ? (
    <ServicesPractForm
      key={`${service.get('id')}PractForm`}
      service={service}
      practitioners={practitioners}
      handleSubmit={handleSubmit}
      practitionerIds={practitionerId}
      formName={`${service.get('id')}practitioners`}
    />
  ) : null;
};

ServicePractitioners.propTypes = {
  service: PropTypes.instanceOf(Service).isRequired,
  updateService: PropTypes.func.isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
};

export default ServicePractitioners;

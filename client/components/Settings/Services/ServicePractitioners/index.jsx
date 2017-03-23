
import { Map } from 'immutable';
import React, { Component, PropTypes } from 'react';
import {  Form, Field, Button, FormSection, Header } from '../../../library';

function createInitialValues(practitionerIds, practitioners) {
  return practitioners.map(p => {
    return practitionerIds.indexOf(p.get('id')) > -1;
  }).toJS();
}

export default function ServicePractitioners(props) {

  // TODO: in case of no practitioners render placeholder instead of the form
  // TODO: put Form in its own component

  const { service, practitioners, updateService } = props;

  let showComponent = null;

  if (!service) {
    return null;
  }

  const handleSubmit = (values) => {
    const storePractitionerIds = [];

    for (const id in values) {
      if (values[id]) {
        storePractitionerIds.push(id);
      }
    }
    const modifiedService = service.set('practitioners', storePractitionerIds);
    updateService(modifiedService);
  };

  const RenderPractitioners = ({ practitioner }) => {
    if (!practitioner) {
      return null;
    }
    const practitionerId = practitioner.get('id');

    return (
      <div>
        {practitioner.getFullName()}
        <Field component="Toggle" name={practitionerId} />
      </div>
    );
  };

  if (practitioners) {
    const practitionerIds = service.get('practitioners');
    const initialValues = createInitialValues(practitionerIds, practitioners);
    showComponent = (
      <Form form={`${service.get('id')}practitioners`} onSubmit={handleSubmit} initialValues={initialValues} >
        {practitioners.toArray().map((practitioner, index) => {
          return (
            <RenderPractitioners
              key={`${service.get('id')}${index}`}
              practitioner={practitioner}
            />
          );
        })}
      </Form>
    );
  }

  return (
    <div>
      <Header title="Practitioners" />
      {showComponent}
    </div>
  )
}

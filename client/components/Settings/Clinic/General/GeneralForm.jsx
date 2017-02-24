
import React from 'react';
import TestForm from '../../../demo/TestForm';

export default function GeneralForm({ onSubmit }) {
  return (
    <TestForm
      onSubmit={onSubmit}
      patient={{ firstName: 'Beckett', middleName: 'Jean', lastName: 'Dental' }}
    />
  );
}

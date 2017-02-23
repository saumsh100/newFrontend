
import React from 'react';
import TestForm from '../../demo/TestForm';

export default function GeneralForm() {
  return (
    <div style={{ padding: '10px' }}>
      <TestForm patient={{ firstName: 'Beckett', middleName: 'Jean', lastName: 'Dental' }} />
    </div>
  );
}

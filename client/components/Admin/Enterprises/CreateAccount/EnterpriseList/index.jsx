
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Field } from '../../../../library';
import Enterprise from '../../../../../entities/models/Enterprise';
import styles from '../styles.scss';

export default function EnterpriseList(props) {
  const {
    enterprises, onSubmit, index, setCreate,
  } = props;

  const enterpriseOptions = enterprises
    .filter(enterprise => enterprise.plan === 'ENTERPRISE' && enterprise)
    .map(enterprise => ({
      value: enterprise.id,
      label: enterprise.name,
    }));

  return (
    <Form
      form="selectEnterpriseForm"
      onChange={(values) => {
        onSubmit(values, index);
      }}
      ignoreSaveButton
    >
      <div className={styles.selectEnterprise}>
        <div className={styles.selectEnterprise_dd}>
          <Field
            name="id"
            label="Select a Group"
            component="DropdownSelect"
            options={enterpriseOptions}
            search="label"
          />
        </div>
        <div className={styles.selectEnterprise_icon}>
          <Button onClick={() => setCreate()} color="blue">
            Add New Group
          </Button>
        </div>
      </div>
    </Form>
  );
}

EnterpriseList.propTypes = {
  onSubmit: PropTypes.func,
  index: PropTypes.number,
  setCreate: PropTypes.func,
  enterprises: PropTypes.arrayOf(Enterprise),
};

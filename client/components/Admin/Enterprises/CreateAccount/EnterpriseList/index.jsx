import React, { Component, PropTypes } from 'react';
import { List, ListItem, Button, Form, Field, IconButton } from '../../../../library';
import styles from '../styles.scss'

class EnterpriseList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      enterprises,
      onSubmit,
      index,
      setCreate,
    } = this.props;

    const enterpriseOptions = enterprises.map((enterprise) => {
      return {
        value: enterprise.id,
        label: enterprise.name,
      };
    });

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
              label="Enterprises"
              component="DropdownSelect"
              options={enterpriseOptions}
            />
          </div>
          <div className={styles.selectEnterprise_icon}>
            <IconButton icon="plus" onClick={()=> setCreate() }/>
          </div>
        </div>
      </Form>
    )
  }
}

EnterpriseList.propTypes = {
}

export default EnterpriseList;

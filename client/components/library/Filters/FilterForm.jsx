
import React, { Component, PropTypes } from 'react';
import { Form, Field } from '../../library';
import { connect } from 'react-redux';
import FilterField from './FilterField';
import styles from './styles.scss';
import FormSection from '../Form/FormSection';

function FilterForm(props) {
  const {
    filters,
    handleSubmit,
    formName,
    flipped,
  } = props;

  return (
    <Form
      form={formName}
      onChange={handleSubmit}
      ignoreSaveButton
    >
      {filters.map((f, i) => {
        const content =
          f.items.map((item, index) => {
            return <FilterField key={`filterField_${index}`} item={item} flipped={flipped} />;
          });

        return (
            <div key={`filterForm_${i}`}>
              <div className={styles.filters__title}>
                {f.titleIcon &&
                <div
                  style={{ backgroundColor: f.titleIcon.color }}
                  className={styles.filters__title__icon}
                >
                  <span className={`fa fa-${f.titleIcon.icon}`} />
                </div>
                }
                {f.title}
              </div>
              <div className={styles.filters__checkFilter}>
                {content}
              </div>
            </div>
        );
      })}
    </Form>
  );
}

FilterForm.propTypes = {
  filters: PropTypes.arrayOf(Object),
  handleSubmit: PropTypes.func,
  formName: PropTypes.string,
};

function mapStateToProps({ form },{ formName }) {

  if (!form[formName]) {
    return {
      values: {},
    };
  }
  return {
    values: form[formName].values,
  }
}

export default connect(mapStateToProps, null)(FilterForm);

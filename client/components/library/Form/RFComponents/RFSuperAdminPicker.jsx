/* eslint-disable react/prop-types, react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ComboBoxComponent from '../../ComboBox';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import styles from '../field.scss';

const SuperAdminPicker = (props) => {
  useEffect(() => {
    if (props.superadmins.size === 0) {
      props.fetchEntities({
        key: 'superadmins',
        url: `/api/users/superadmins`,
      });
    }
  }, []);

  const mappedSuperAdmins = Array.from(props.superadmins, ([key, values]) => {
    const adminName = `${values.firstName} ${values.lastName}`;
    return {
      label: adminName,
      value: key,
    };
  });

  const selectedValue = mappedSuperAdmins.find((opt) => {
    return opt.value === props.input.value;
  });

  return (
    <>
      <label htmlFor={props.name} className={styles.fieldLabel}>
        {props.label}
      </label>
      <ComboBoxComponent
        onChange={(opt) => {
          props.input.onChange(opt.value);
        }}
        options={mappedSuperAdmins}
        value={selectedValue}
        isDisabled={props.disabled}
        placeholder="Select a CSM Account Owner.."
        {...props}
      />
    </>
  );
};
const mapStateToProps = ({ entities }) => {
  return {
    superadmins: entities.getIn(['superadmins', 'models']),
  };
};

const dispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchEntities,
    },
    dispatch,
  );

export default connect(mapStateToProps, dispatchToProps)(SuperAdminPicker);

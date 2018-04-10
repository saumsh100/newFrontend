
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import graphQLEnvironment from '../../../../../util/graphqlEnvironment';
import { Grid, Row, Col, IconButton, Form, FormSection } from '../../../../library';
import Family from '../../../Shared/Family';
import FamilyMember from '../../../Shared/FamilyMember';
import PatientSearch from '../../../../PatientSearch';
import removePatientFromFamily from '../../graphQL/removePatientFromFamily';
import addPatientToFamily from '../../graphQL/addPatientToFamily';
import addFamilyWithMembers from '../../graphQL/addFamilyWithMembers';
import makePatientHeadOfFamily from '../../graphQL/makePatientHeadOfFamily';
import styles from './styles.scss';

const patientSearchTheme = {
  container: styles.patientSearchClass,
};

const patientSearchInputProps = {
  classStyles: styles.patientSearchInput,
  placeholder: 'Add a patient to this family',
};

const renderMemberList = ({ family, patientNode }) => (
  <Row className={styles.familyFormContainer}>
    <Family
      family={family}
      render={familyMembers =>
        familyMembers.map(familyMember => (
          <Row>
            <Col xs={12}>
              <FamilyMember
                key={familyMember.id}
                {...familyMember}
                handleMakeHead={() =>
                  makePatientHeadOfFamily.commit(graphQLEnvironment, familyMember.node, family)
                }
                handleRemoveFromFamily={() =>
                  removePatientFromFamily.commit(
                    graphQLEnvironment,
                    familyMember.node,
                    patientNode.id,
                  )
                }
              />
            </Col>
          </Row>
        ))
      }
    />
  </Row>
);

const renderAddFamily = ({ family, patientNode }) => (
  <Row className={styles.withPadding}>
    <PatientSearch
      onSelect={patient =>
        (family === null
          ? addFamilyWithMembers.commit(
            graphQLEnvironment,
            [patient.id, patientNode.ccId],
            patientNode.id,
          )
          : addPatientToFamily.commit(graphQLEnvironment, patient, family.ccId, patientNode.id))
      }
      theme={patientSearchTheme}
      inputProps={patientSearchInputProps}
      focusInputOnMount
    />
  </Row>
);

const FamilyForm = (props) => {
  const { handleSubmit, familyLength } = props;

  return (
    <Form form="Form4" onSubmit={handleSubmit} ignoreSaveButton>
      <FormSection name="family">
        <Grid>
          {renderAddFamily(props)}
          {familyLength > 0 && renderMemberList(props)}
        </Grid>
      </FormSection>
    </Form>
  );
};

FamilyForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  familyLength: PropTypes.number,
};

export default FamilyForm;


import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form, FormSection } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';
import Family from '../../../Shared/Family';
import FamilyMember from '../../../Shared/FamilyMember';
import PatientSearch from '../../../../PatientSearch';
import RemovePatientFamily from '../../graphQL/removePatientFromFamily';
import AddPatientToAFamilyOrCreateFamilyWithMembers from '../../graphQL/addPatientToFamily';
import { isResponsive } from '../../../../../util/hub';
import MakeHeadOfFamily from '../../graphQL/makePatientHeadOfFamily';
import styles from './styles.scss';

const patientSearchTheme = {
  container: styles.patientSearchClass,
};

const patientSearchInputProps = {
  classStyles: styles.patientSearchInput,
  placeholder: 'Add a patient to this family',
};

const relayFamilyShape = PropTypes.shape({
  id: PropTypes.string,
  ccId: PropTypes.string,
  head: PropTypes.shape(patientShape),
  members: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        cursor: PropTypes.string,
        node: PropTypes.shape(patientShape),
      }),
    ),
    pageInfo: PropTypes.shape({
      endCursor: PropTypes.string,
      hasNextPage: PropTypes.bool,
    }),
  }),
});

const memberListPropTypes = {
  family: relayFamilyShape,
  patientNode: PropTypes.shape(patientShape),
};

const renderMemberList = ({ family, patientNode }) => (
  <Row className={styles.familyFormContainer}>
    <Family
      family={family}
      render={familyMembers =>
        familyMembers.map(familyMember => (
          <Row>
            <Col xs={12}>
              <RemovePatientFamily currentPatientId={patientNode.ccId}>
                {removePatientFamily => (
                  <MakeHeadOfFamily>
                    {makeHeadOfFamily => (
                      <FamilyMember
                        key={familyMember.id}
                        {...familyMember}
                        handleMakeHead={() =>
                          makeHeadOfFamily({
                            variables: {
                              input: {
                                id: family.ccId,
                                headId: familyMember.node.ccId,
                                accountId: familyMember.node.accountId,
                                clientMutationId: family.id,
                              },
                            },
                          })
                        }
                        handleRemoveFromFamily={() =>
                          removePatientFamily({
                            variables: {
                              input: {
                                id: familyMember.node.ccId,
                                firstName: familyMember.node.firstName,
                                lastName: familyMember.node.lastName,
                                omitRecallIds: familyMember.node.omitRecallIds,
                                omitReminderIds: familyMember.node.omitReminderIds,
                                accountId: familyMember.node.accountId,
                                familyId: null,
                                clientMutationId: patientNode.id,
                              },
                            },
                          })
                        }
                      />
                    )}
                  </MakeHeadOfFamily>
                )}
              </RemovePatientFamily>
            </Col>
          </Row>
        ))
      }
    />
  </Row>
);

renderMemberList.propTypes = memberListPropTypes;
renderMemberList.defaultProps = {
  family: null,
  patientNode: null,
};

const renderAddFamily = ({ family, patientNode }) => (
  <Row className={styles.withPadding}>
    <AddPatientToAFamilyOrCreateFamilyWithMembers
      currentPatientId={patientNode.ccId}
      hasFamily={!!family}
    >
      {addPatientOrCreateFamily => (
        <PatientSearch
          focusInputOnMount
          onSelect={patient =>
            addPatientOrCreateFamily({
              variables: {
                input: {
                  ...(family
                    ? {
                        id: patient.id,
                        accountId: patient.accountId,
                        firstName: patient.firstName,
                        lastName: patient.lastName,
                        omitRecallIds: patient.omitRecallIds,
                        omitReminderIds: patient.omitReminderIds,
                        familyId: family.ccId,
                      }
                    : { members: [patient.id, patientNode.ccId] }),
                  clientMutationId: patientNode.id,
                },
              },
            })
          }
          theme={patientSearchTheme}
          inputProps={patientSearchInputProps}
        />
      )}
    </AddPatientToAFamilyOrCreateFamilyWithMembers>
  </Row>
);

renderAddFamily.propTypes = memberListPropTypes;

renderAddFamily.defaultProps = {
  family: null,
  patientNode: null,
};

const FORM_NAME = 'Form3';

const FamilyForm = (props) => {
  const { handleSubmit, familyLength } = props;

  return (
    <Form
      form={FORM_NAME}
      onSubmit={handleSubmit}
      className={styles.formContainer}
      ignoreSaveButton={!isResponsive()}
    >
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
FamilyForm.defaultProps = {
  familyLength: 0,
};

export default FamilyForm;

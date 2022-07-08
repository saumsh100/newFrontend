import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isResponsive } from '../../../../util/hub';
import styles from './styles.scss';
import { getTodaysDate, getUTCDate } from '../../../library';

const isMemberHead = (member, head) => head && member.ccId === head.ccId;

const sortFamilyMembers = (head) => (a, b) => {
  if (isMemberHead(a, head)) return -1;
  return isMemberHead(b, head) ? 1 : 0;
};

const renderFamilyMembers = (head, timezone) => (node, i, arr) => {
  const patient = {
    avatarUrl: node.avatarUrl,
    firstName: node.firstName,
    lastName: node.lastName,
    birthDate: node.birthDate,
    age: getTodaysDate(timezone).diff(getUTCDate(node.birthDate, timezone), 'years'),
    lastApptDate:
      node.lastApptDate && getUTCDate(node.lastApptDate, timezone).format('MMM D, YYYY'),
    nextApptDate:
      node.nextApptDate && getUTCDate(node.nextApptDate, timezone).format('MMM D, YYYY'),
    dueForHygieneDate: node.dueForHygieneDate,
    dueForRecallExamDate: node.dueForRecallExamDate,
    cellPhoneNumber: node.cellPhoneNumber,
  };

  const activeAccount = node.status === 'Active';

  const familyMemberData = {
    patient,
    fullName: `${patient.firstName} ${patient.lastName}`,
    age: patient.age,
    lastApp: patient.lastApptDate,
    nextApp: patient.nextApptDate,
    className: styles.familyMember_fontStyle,
    activeAccount,
  };

  return {
    ...familyMemberData,
    withBorder: arr.length - 1 !== i,
    isHead: isMemberHead(node, head),
    key: node.id,
    node,
  };
};

const Family = ({ family, render, timezone }) => {
  const { head } = family;
  const members = family.members.edges.map((v) => v.node);

  return (
    <div
      className={isResponsive() ? styles.familyMemberContainerMobile : styles.familyMemberContainer}
    >
      {render(members.sort(sortFamilyMembers(head)).map(renderFamilyMembers(head, timezone)))}
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(Family);

Family.propTypes = {
  family: PropTypes.shape({
    id: PropTypes.string,
    head: PropTypes.shape({ accountId: PropTypes.string }),
    members: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          fullName: PropTypes.string,
          age: PropTypes.number,
          patient: PropTypes.shape({
            avatarUrl: PropTypes.string,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
          }),
          lastApp: PropTypes.string,
          nextApp: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
  render: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

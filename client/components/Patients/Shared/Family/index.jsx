
import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { isResponsive } from '../../../../util/hub';
import styles from './styles.scss';

const isMemberHead = (member, head) => head && member.ccId === head.ccId;

const sortFamilyMembers = head => (a, b) => {
  if (isMemberHead(a, head)) return -1;
  return isMemberHead(b, head) ? 1 : 0;
};

const renderFamilyMembers = head => (node, i, arr) => {
  const patient = {
    avatarUrl: node.avatarUrl,
    firstName: node.firstName,
    lastName: node.lastName,
    birthDate: node.birthDate,
    age: moment().diff(moment(node.birthDate), 'years'),
    lastApptDate:
      node.lastApptDate && moment(node.lastApptDate).format('MMM D, YYYY'),
    nextApptDate:
      node.nextApptDate && moment(node.nextApptDate).format('MMM D, YYYY'),
    dueForHygieneDate: node.dueForHygieneDate,
    dueForRecallExamDate: node.dueForRecallExamDate,
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
    key: node.ccId,
    ...familyMemberData,
    withBorder: arr.length - 1 !== i,
    isHead: isMemberHead(node, head),
    node,
  };
};

const Family = ({ family, render }) => {
  const head = family.head;
  const members = family.members.edges.map(v => v.node);

  return (
    <div
      className={
        isResponsive()
          ? styles.familyMemberContainerMobile
          : styles.familyMemberContainer
      }
    >
      {render(members.sort(sortFamilyMembers(head)).map(renderFamilyMembers(head)))}
    </div>
  );
};

Family.propTypes = {
  family: PropTypes.shape({
    members: {
      edges: PropTypes.array,
    },
  }),
  render: PropTypes.func,
};

export default Family;

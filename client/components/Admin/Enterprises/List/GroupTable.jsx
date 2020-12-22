
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountsSubComponent from './AccountsSubComponent';
import { IconButton, DataTable } from '../../../library';
import { formattedDate } from './Shared/helpers';
import styles from './styles.scss';

const GroupTable = ({ data, loaded, expanded, timezone, handleRowClick, selectEnterprise }) => {
  const tableStyle = { height: '100%' };
  const subComponent = enterprise => (
    <AccountsSubComponent enterpriseId={enterprise.original.id} enterprise={enterprise} />
  );

  const getGroupName = ({ original, viewIndex }) => (
    <div style={{ display: 'flex' }}>
      <span
        tabIndex={0}
        role="button"
        onKeyDown={e => e.keyCode === 13 && handleRowClick({ viewIndex })}
      >
        {original.name}
      </span>
      <span style={{ marginLeft: '5px' }}>-</span>
      <input value={original.id} className={styles.fakeInput} tabIndex={0} />
    </div>
  );

  const selectPractice = ({ original }) => (
    <div className={styles.groupName}>
      <IconButton
        icon="sign-in-alt"
        onClick={(e) => {
          e.stopPropagation();
          return selectEnterprise(original.id);
        }}
      />
    </div>
  );
  const columns = [
    {
      Header: 'Group Name',
      id: 'name',
      width: 500,
      accessor: d => `${d.name} (${d.id})`,
      Cell: getGroupName,
      filterable: true,
      filterMethod: ({ id, value }, row) =>
        (row[id] ? String(row[id].toLowerCase()).includes(value.toLowerCase()) : true),
    },
    {
      Header: 'Plan',
      id: 'plan',
      accessor: d => d.plan,
    },
    {
      Header: 'Created On',
      id: 'createdAt',
      accessor: d => d.createdAt,
      Cell: ({ row }) => formattedDate(row.createdAt, timezone),
    },
    {
      Header: 'Updated On',
      id: 'updatedAt',
      accessor: d => d.updatedAt,
      Cell: ({ row }) => formattedDate(row.updatedAt, timezone),
    },
    {
      Header: 'Select Practice',
      Cell: selectPractice,
      maxWidth: 130,
    },
  ];

  return (
    <DataTable
      key="Group Table"
      data={data}
      columns={columns}
      loading={loaded}
      SubComponent={subComponent}
      expanded={expanded}
      handleRowClick={handleRowClick}
      loadingText=""
      noDataText="No Groups Found"
      showPageSizeOptions
      style={tableStyle}
    />
  );
};

GroupTable.propTypes = {
  loaded: PropTypes.bool,
  expanded: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
  handleRowClick: PropTypes.func.isRequired,
  original: PropTypes.shape({ id: PropTypes.string }),
  selectEnterprise: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string,
      deletedAt: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      plan: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
  ),
  timezone: PropTypes.string.isRequired,
};

GroupTable.defaultProps = {
  loaded: false,
  expanded: [],
  original: {},
  data: [],
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(
  mapStateToProps,
  null,
)(GroupTable);

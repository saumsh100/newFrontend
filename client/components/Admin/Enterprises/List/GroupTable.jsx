import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountsSubComponent from './AccountsSubComponent';
import { IconButton, DataTable } from '../../../library';
import { formattedDate } from './Shared/helpers';
import ManageCell from './ManageCell';
import styles from './styles.scss';
import { enterpriseShape } from '../../../library/PropTypeShapes';

const SubComponent = (enterprise) => (
  <AccountsSubComponent enterpriseId={enterprise.original.id} enterprise={enterprise} />
);

export const GroupTable = ({
  data,
  pages,
  loaded,
  expanded,
  timezone,
  handleRowClick,
  onDeleteGroup,
  onEditName,
  selectEnterprise,
  onFetchData,
}) => {
  const formattedDateValue = useCallback(
    ({ row, column }) => formattedDate(row[column.id], timezone),
    [timezone],
  );

  const getGroupName = useCallback(
    ({ original, viewIndex }) => (
      <div style={{ display: 'flex' }}>
        <span
          tabIndex={0}
          role="button"
          data-testid="name"
          onKeyDown={(e) => e.keyCode === 13 && handleRowClick({ viewIndex })}
        >
          {original.name}
        </span>
        <span style={{ marginLeft: '5px' }}>-</span>
        <input value={original.id} className={styles.fakeInput} tabIndex={0} />
      </div>
    ),
    [handleRowClick],
  );

  const selectPractice = useCallback(
    ({ original }) => (
      <div className={styles.groupName}>
        <IconButton
          icon="sign-in-alt"
          onClick={(e) => {
            e.stopPropagation();
            return selectEnterprise(original.id);
          }}
        />
      </div>
    ),
    [selectEnterprise],
  );

  const getManageCell = useCallback(
    (cellProps) => (
      <ManageCell label="Enterprise" {...cellProps} onEdit={onEditName} onDelete={onDeleteGroup} />
    ),
    [onEditName, onDeleteGroup],
  );

  const columns = [
    {
      Header: 'Enterprise Name',
      id: 'name',
      width: 500,
      accessor: (d) => `${d.name} (${d.id})`,
      Cell: getGroupName,
      filterable: true,
    },
    {
      Header: 'Plan',
      id: 'plan',
      accessor: (d) => d.plan,
    },
    {
      Header: 'Created On',
      id: 'createdAt',
      accessor: (d) => d.createdAt,
      Cell: formattedDateValue,
    },
    {
      Header: 'Updated On',
      id: 'updatedAt',
      accessor: (d) => d.updatedAt,
      Cell: formattedDateValue,
    },
    {
      Header: 'Select Practice',
      Cell: selectPractice,
      maxWidth: 130,
      sortable: false,
    },
    {
      id: 'manage',
      Header: 'Manage',
      accessor: (d) => d,
      className: styles.manageCell,
      sortable: false,
      Cell: getManageCell,
    },
  ];

  return (
    <DataTable
      className={styles.dataTable}
      key="Enterprise Table"
      data={data}
      pages={pages}
      columns={columns}
      loading={loaded}
      SubComponent={SubComponent}
      expanded={expanded}
      handleRowClick={handleRowClick}
      loadingText=""
      noDataText="No Enterprises Found"
      showPageSizeOptions
      onFetchData={onFetchData}
      manual
    />
  );
};

GroupTable.propTypes = {
  loaded: PropTypes.bool,
  expanded: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
  handleRowClick: PropTypes.func.isRequired,
  onDeleteGroup: PropTypes.func.isRequired,
  onEditName: PropTypes.func.isRequired,
  onFetchData: PropTypes.func.isRequired,
  original: PropTypes.shape({ id: PropTypes.string }),
  selectEnterprise: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(enterpriseShape)),
  pages: PropTypes.number,
  timezone: PropTypes.string.isRequired,
};

GroupTable.defaultProps = {
  loaded: false,
  expanded: {},
  original: {},
  data: [],
  pages: 10,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(GroupTable);

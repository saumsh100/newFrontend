import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formattedDate } from '../Shared/helpers';
import { DataTable } from '../../../../library';
import { accountShape } from '../../../../library/PropTypeShapes';
import ManageCell from '../ManageCell';
import styles from '../styles.scss';

const getAccountID = ({ original }) => (
  <div style={{ display: 'flex' }}>
    <input value={original.id} className={styles.fakeInput} tabIndex={0} />
  </div>
);

getAccountID.propTypes = {
  original: PropTypes.shape({ id: PropTypes.string }).isRequired,
};

const AccountsTable = ({ accounts, loaded, timezone, onEditName, onDeleteAccount }) => {
  const columns = [
    {
      Header: 'Account Name',
      id: 'name',
      accessor: (d) => d.name,
    },
    {
      Header: 'Send Reminders',
      id: 'canSendReminders',
      accessor: (d) => d.canSendReminders,
      Cell: ({ row }) => (row.canSendReminders ? 'True' : 'False'),
    },
    {
      Header: 'Send Recalls',
      id: 'canSendRecalls',
      accessor: (d) => d.canSendRecalls,
      Cell: ({ row }) => (row.canSendRecalls ? 'True' : 'False'),
    },
    {
      Header: 'Send Reviews',
      id: 'canSendReviews',
      accessor: (d) => d.canSendReviews,
      Cell: ({ row }) => (row.canSendReviews ? 'True' : 'False'),
    },
    {
      Header: 'Last Sync Date',
      id: 'lastSyncDate',
      accessor: (d) => d.lastSyncDate,
      Cell: ({ row }) => formattedDate(row.createdAt, timezone),
    },
    {
      Header: 'Account ID',
      id: 'id',
      width: 400,
      accessor: (d) => d.id,
      Cell: getAccountID,
    },
    {
      id: 'manage',
      Header: 'Manage',
      accessor: (d) => d,
      className: styles.manageCell,
      Cell: (cellProps) => (
        <ManageCell
          label="Practice"
          {...cellProps}
          onEdit={onEditName}
          onDelete={onDeleteAccount}
        />
      ),
      sortable: false,
    },
  ];

  return (
    <div className={styles.accountsTableContainer}>
      <DataTable
        key="Accounts Table"
        data={accounts}
        columns={columns}
        defaultPageSize={accounts ? accounts.length : 50} // 50 will never be used unless for some reason the accounts failed to load.
        loading={loaded}
        handleRowClick={() => null}
        showPagination={false}
        rowStyling={styles.rowStyling}
      />
    </div>
  );
};

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape(accountShape)).isRequired,
  loaded: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
  onEditName: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
};

AccountsTable.defaultProps = {
  loaded: false,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(AccountsTable);

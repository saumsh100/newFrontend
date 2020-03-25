
import React from 'react';
import PropTypes from 'prop-types';
import { formatedDate } from '../Shared/helpers';
import { DataTable } from '../../../../library';
import { accountShape } from '../../../../library/PropTypeShapes';
import styles from '../styles.scss';

const columns = [
  {
    Header: 'Account Name',
    id: 'name',
    accessor: d => d.name,
  },
  {
    Header: 'Send Reminders',
    id: 'canSendReminders',
    accessor: d => d.canSendReminders,
    Cell: ({ row }) => (row.canSendReminders ? 'True' : 'False'),
  },
  {
    Header: 'Send Recalls',
    id: 'canSendRecalls',
    accessor: d => d.canSendRecalls,
    Cell: ({ row }) => (row.canSendRecalls ? 'True' : 'False'),
  },
  {
    Header: 'Send Reviews',
    id: 'canSendReviews',
    accessor: d => d.canSendReviews,
    Cell: ({ row }) => (row.canSendReviews ? 'True' : 'False'),
  },
  {
    Header: 'Last Sync Date',
    id: 'lastSyncDate',
    accessor: d => d.lastSyncDate,
    Cell: ({ row }) => formatedDate(row.createdAt),
  },
  {
    Header: 'Account ID',
    id: 'id',
    width: 400,
    accessor: d => d.id,
    Cell: ({ original }) => (
      <div style={{ display: 'flex' }}>
        <input value={original.id} className={styles.fakeInput} tabIndex={0} />
      </div>
    ),
  },
];

export default function AccountsTable(props) {
  const { accounts, loaded } = props;

  return (
    <div className={styles.accountsTableContainer}>
      <DataTable
        key="Accounts Table"
        data={accounts}
        columns={columns}
        defaultPageSize={30}
        loading={loaded}
        handleRowClick={() => null}
        showPagination={false}
        rowStyling={styles.rowStyling}
      />
    </div>
  );
}

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape(accountShape)).isRequired,
  loaded: PropTypes.bool,
};

AccountsTable.defaultProps = {
  loaded: false,
};

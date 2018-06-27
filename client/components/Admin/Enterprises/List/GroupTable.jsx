
import React from 'react';
import PropTypes from 'prop-types';
import AccountsSubComponent from './AccountsSubComponent';
import { IconButton, DataTable } from '../../../library';
import { formatedDate } from './Shared/helpers';
import styles from './styles.scss';

const subComponent = enterprise => (
  <AccountsSubComponent
    enterpriseId={enterprise.original.id}
    enterprise={enterprise}
  />
);

export default function GroupTable(props) {
  const {
    data, loaded, expanded, handleRowClick,
  } = props;

  const columns = [
    {
      Header: 'Group Name',
      id: 'name',
      accessor: d => d.name,
      filterable: true,
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
      Cell: ({ row }) => formatedDate(row.createdAt),
    },
    {
      Header: 'Updated On',
      id: 'updatedAt',
      accessor: d => d.updatedAt,
      Cell: ({ row }) => formatedDate(row.updatedAt),
    },
    {
      Header: 'Enter the Prise',
      Cell: ({ original }) => (
        <div className={styles.groupName}>
          <IconButton
            icon="sign-in-alt"
            onClick={(e) => {
              e.stopPropagation();
              return props.selectEnterprise(original.id);
            }}
          />
        </div>
      ),
      maxWidth: 130,
    },
  ];

  return (
    <DataTable
      key="Group Table"
      data={data}
      columns={columns}
      defaultPageSize={20}
      loading={loaded}
      SubComponent={subComponent}
      expanded={expanded}
      handleRowClick={handleRowClick}
      loadingText=""
      noDataText="No Groups Found"
      showPagination={false}
    />
  );
}

GroupTable.propTypes = {
  loaded: PropTypes.bool,
  expanded: PropTypes.arrayOf(PropTypes.string),
  handleRowClick: PropTypes.func,
  selectEnterprise: PropTypes.func,
  original: PropTypes.shape({
    id: PropTypes.string,
  }),
  data: PropTypes.arrayOf(PropTypes.shape({
    createdAt: PropTypes.string,
    deletedAt: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    plan: PropTypes.string,
    updatedAt: PropTypes.string,
  })),
};


import React from 'react';
import PropTypes from 'prop-types';
import AccountsSubComponent from './AccountsSubComponent';
import { IconButton, DataTable } from '../../../library';
import { formatedDate } from './Shared/helpers';
import styles from './styles.scss';

const subComponent = enterprise => (
  <AccountsSubComponent enterpriseId={enterprise.original.id} enterprise={enterprise} />
);

export default function GroupTable(props) {
  const { data, loaded, expanded, handleRowClick } = props;

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
      Header: 'Select Practice',
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

  const tableStyle = { height: '100%' };

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
}

GroupTable.propTypes = {
  loaded: PropTypes.bool,
  expanded: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
  handleRowClick: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    createdAt: PropTypes.string,
    deletedAt: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    plan: PropTypes.string,
    updatedAt: PropTypes.string,
  })),
};

GroupTable.defaultProps = {
  loaded: false,
  expanded: [],
  original: {},
  data: [],
};

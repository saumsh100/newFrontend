import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styles from './styles.scss';

const tableStyle = {
  className: styles.mainTableStyle,
};

const footerStyle = {
  className: styles.footerStyle,
};

const headerStyle = {
  className: styles.headerStyle,
};

const bodyStyle = {
  className: styles.bodyStyle,
};

const columnHeaderStyle = {
  style: {
    background: 'white',
    display: 'flex',
    justifyContent: 'flex-start',
    boxShadow: 'none',
    alignItems: 'center',
    borderRight: 'none',
    color: '#a7a9ac',
    outline: 'none',
  },
  className: styles.columnHeaderStyle,
};

const tdStyle = {
  className: styles.tdStyle,
};

const trStyle = {
  className: styles.trStyle,
};

function getTheadStyles(state, column) {
  const check = state.sorted.length;

  let sortedClasses = styles.theadAsc;
  if (check && column.id === state.sorted[0].id && state.sorted[0].desc) {
    sortedClasses = styles.theadDesc;
  }

  return {
    style: columnHeaderStyle.style,
    className: check && column.id === state.sorted[0].id ? sortedClasses : null,
  };
}
export default function DataTable(props) {
  const { handleRowClick, rowStyling, onFiltersChange } = props;

  if (rowStyling) {
    trStyle.className = classnames(trStyle.className, rowStyling);
  }

  return (
    <ReactTable
      tableStyle={styles.tbStyle}
      eProps={() => tableStyle}
      getTheadTrProps={() => headerStyle}
      getTfootThProps={() => footerStyle}
      getTbodyProps={() => bodyStyle}
      getTrProps={() => trStyle}
      getTdProps={(state, rowInfo, column) => ({
        onClick: (e, handleOriginal) => {
          handleRowClick(rowInfo, column);
          if (handleOriginal) {
            handleOriginal();
          }
        },
        ...tdStyle,
      })}
      getTheadThProps={(state, rowInfo, column) => getTheadStyles(state, column)}
      onFilteredChange={(filtered, column) => {
        if (onFiltersChange) {
          onFiltersChange(filtered, column);
        }
      }}
      {...props}
    />
  );
}

DataTable.propTypes = {
  handleRowClick: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func,
  rowStyling: PropTypes.string,
};

DataTable.defaultProps = {
  onFiltersChange: null,
  rowStyling: null,
};

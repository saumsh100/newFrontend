
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Icon, Tooltip } from '../../../library';
import LoadingBar from '../../../library/LoadingBar';
import SettingsCard from '../../Shared/SettingsCard';
import FetchAvailableForms from './FetchAvailableForms';
import styles from './styles.scss';

export const backgroundWhite = { style: { background: 'white' } };
export const tableStyle = {
  background: 'white',
  border: '0px',
  padding: '20px 40px',
};
export const headerStyle = {
  style: {
    background: 'white',
    paddingTop: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #efefef',
    fontSize: '12px',
  },
};
export const bodyStyle = {
  style: {
    background: 'white',
  },
};
export const columnHeaderStyle = {
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
};
export const dataStyle = {
  style: {
    border: 'none',
  },
};

class Forms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipText: 'Copy to Clipboard',
    };

    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  copyToClipboard(value) {
    const textArea = document.createElement('textarea');
    textArea.value = value;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.setState({ tooltipText: 'Copied!' });
    setTimeout(() => {
      this.setState({ tooltipText: 'Copy to Clipboard' });
    }, 1000);
  }

  render() {
    const tooltipOverlay = <span>{this.state.tooltipText}</span>;

    const columns = [
      {
        accessor: 'title',
        Header: () => <div className={styles.titleHeader}>Name</div>,
        Cell: ({ value }) => <div className={styles.titleCell}>{value}</div>,
      },
      {
        accessor: 'compressedUrl',
        Header: () => <div className={styles.linkHeader}>Link</div>,
        Cell: ({ value }) => (
          <button className={styles.linkCell} onClick={() => this.copyToClipboard(value)}>
            <Tooltip overlay={tooltipOverlay}>
              <div className={styles.linkCellContent}>
                {value}
                <Icon icon="clipboard" className={styles.clipboardIcon} />
              </div>
            </Tooltip>
          </button>
        ),
      },
    ];

    return (
      <SettingsCard title="Forms" className={styles.container}>
        <FetchAvailableForms
          accountId={this.props.accountId}
          render={({ isLoading, forms }) =>
            (isLoading || !forms ? (
              <LoadingBar />
            ) : (
              <ReactTable
                data={forms}
                columns={columns}
                minRows={0}
                showPagination={false}
                sortable={false}
                getTableProps={() => backgroundWhite}
                getTheadTrProps={() => headerStyle}
                getTheadThProps={() => columnHeaderStyle}
                getTfootThProps={() => backgroundWhite}
                getTbodyProps={() => bodyStyle}
                getTdProps={() => dataStyle}
                style={tableStyle}
              />
            ))
          }
        />
      </SettingsCard>
    );
  }
}

Forms.propTypes = {
  accountId: PropTypes.string.isRequired,
};

function mapStateToProps({ auth }) {
  return {
    accountId: auth.get('accountId'),
  };
}

export default connect(
  mapStateToProps,
  null,
)(Forms);

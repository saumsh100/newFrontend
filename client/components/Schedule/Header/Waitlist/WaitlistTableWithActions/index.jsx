
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { capitalize } from '@carecru/isomorphic';
import ReactTable from 'react-table';
import { Avatar, Button, Checkbox, DropdownMenu, Icon } from '../../../../library';
import Tooltip from '../../../../Tooltip';
import { propsGenerator } from '../helpers';
import FilterBar from './FilterBar';
import WaitListTableHeader from './WaitListTableHeader';
import WaitListTableFooter from './WaitListTableFooter';
import { theadStyles, colHeaderStyle, tbodyStyles, trStyles } from './tableStyles';
import tableStyles from '../tableStyles.scss';
import styles from './styles.scss';
import EllipsisIcon from '../EllipsisIcon';

const Index = ({
  waitlist,
  selectedWaitlistMap,
  setSelectedWaitlistMap,
  removeMultipleWaitSpots,
  batchUpdate,
  goToSendMassMessage,
  goToAddWaitListForm,
  defaultUnit,
  ...parentProps
}) => {
  const [selectedColumn, setSelectedColumn] = useState('addedDate');
  const [segmentedWaitList, updateSegmentedWaitList] = useState(waitlist);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const selectedWaitlistIds = useMemo(
    () =>
      Object.entries(selectedWaitlistMap)
        .filter(([, v]) => v)
        .map(([v]) => v),
    [selectedWaitlistMap],
  );

  const segmentedWaitListIds = segmentedWaitList.map(waitSpot => waitSpot.id);

  const isEveryWaitlistSelected =
    segmentedWaitList?.length > 0 && segmentedWaitList?.length === selectedWaitlistIds?.length;

  useEffect(() => {
    const waitlistIdsInView = selectedWaitlistIds.filter(id => segmentedWaitListIds.includes(id));
    if (selectedWaitlistIds?.length > 0) {
      setSelectedWaitlistMap(batchUpdate(true, waitlistIdsInView));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentedWaitList]);

  const toggleAllWaitlistSelection = () => {
    setSelectedWaitlistMap(batchUpdate(!isEveryWaitlistSelected, segmentedWaitListIds));
  };

  const toggleSingleWaitlistSelection = (key) => {
    setSelectedWaitlistMap(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const waitlistWithProps = segmentedWaitList.map((spot) => {
    const generatedProps = propsGenerator({
      ...spot,
      ...parentProps,
      toggleSingleWaitlistSelection,
      selectedWaitlistMap,
    });

    const availableTimes = spot.availableTimes.map(time => moment(time).toISOString());

    return { ...generatedProps,
      availableTimes };
  });

  const sortHelper = useCallback((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }, []);

  const columns = [
    {
      id: 'waitSpotCheckbox',
      Header: () => (
        <Checkbox
          className={styles.waitSpotCheckboxWrapper}
          checked={isEveryWaitlistSelected}
          onChange={toggleAllWaitlistSelection}
        />
      ),
      accessor: waitspot => waitspot,
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <Checkbox
          className={styles.waitSpotCheckboxWrapper}
          checked={value.checked}
          onChange={value.onChange}
        />
      ),
      sortable: false,
      width: 70,
    },
    {
      Header: 'Date Added',
      accessor: 'addedDate', // String-based value accessors!
    },
    {
      id: 'userAvatar',
      sortable: false,
      maxWidth: 60,
      accessor: waitspot => waitspot,
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => value.patient && <Avatar user={value.patient} size="xs" />,
    },
    {
      id: 'firstName',
      Header: 'First Name',
      accessor: waitspot => waitspot,
      sortMethod: (a, b) => sortHelper(a.patient.firstName, b.patient.firstName),
      Cell: ({ value }) => {
        const { PopOverComponent, patient } = value;
        return (
          patient && (
            <PopOverComponent patient={patient} zIndex={9999}>
              <div>{`${patient.firstName}`}</div>
            </PopOverComponent>
          )
        );
      },
    },
    {
      id: 'lastName',
      Header: 'Last Name',
      accessor: waitspot => waitspot,
      sortMethod: (a, b) => sortHelper(a.patient.lastName, b.patient.lastName),
      Cell: ({ value }) => {
        const { PopOverComponent, patient } = value;
        return (
          patient && (
            <PopOverComponent patient={patient} zIndex={9999}>
              <div>{`${patient.lastName}`}</div>
            </PopOverComponent>
          )
        );
      },
    },
    {
      id: 'reasonText',
      Header: 'Reason',
      accessor: waitspot => capitalize(waitspot.reasonText || ''),
    },
    {
      id: 'practitioners',
      Header: 'Practitioner',
      accessor: waitspot => capitalize(waitspot.practitioner?.firstName || ''),
    },
    {
      id: 'duration',
      Header: () => (
        <>
          Units{' '}
          <Tooltip body={<div>Units are in {defaultUnit}-minute intervals</div>} placement="above">
            <Icon icon="question-circle" size={0.9} />
          </Tooltip>
        </>
      ),
      accessor: waitspot => waitspot.duration || '',
    },
    {
      Header: 'Days',
      accessor: 'dates',
    },
    {
      id: 'times',
      Header: 'Times',
      accessor: waitspot => waitspot,
      sortMethod: (a, b) => sortHelper(a.availableTimes, b.availableTimes),
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <Tooltip
          body={<div>{value.times}</div>}
          placement="below"
          tipSize={0.01}
          styleOverride={tableStyles.notesTooltip}
        >
          <div className={tableStyles.noteTDWrapper}>{value.times}</div>
        </Tooltip>
      ),
    },
    {
      Header: 'Next Appt',
      accessor: 'nextApptDate',
    },
    {
      id: 'waitspotNotes',
      Header: 'Notes',
      sortMethod: (a, b) => sortHelper(a.note, b.note),
      accessor: waitspot => waitspot,
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <Tooltip
          body={<div>{value.note}</div>}
          placement="below"
          tipSize={0.01}
          styleOverride={tableStyles.notesTooltip}
        >
          <div className={tableStyles.noteTDWrapper}>{value.note}</div>
        </Tooltip>
      ),
    },
    {
      id: 'manage',
      Header: 'Manage',
      accessor: waitspot => waitspot,
      className: styles.manageCell,
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <DropdownMenu
          labelComponent={props => (
            <Button {...props} className={tableStyles.ellipsisButton}>
              <EllipsisIcon />
            </Button>
          )}
        >
          {!value.isPatientUser && (
            <Button className={tableStyles.actionItem} onClick={value.onEdit(value.id)}>
              Edit
            </Button>
          )}
          <Button className={tableStyles.actionItem} onClick={value.onRemove}>
            Delete
          </Button>
        </DropdownMenu>
      ),
      sortable: false,
    },
  ];

  return (
    <>
      <WaitListTableHeader exitFullScreen={parentProps.onOverlayClick} />
      <div className={tableStyles.waitList}>
        <div className={tableStyles.headerTable}>
          <h3>
            {segmentedWaitList?.length && isFilterActive ? (
              <>
                <span className={styles.waitListCountWrapper}>{segmentedWaitList?.length}</span> of{' '}
                {waitlist?.length} in Waitlist
              </>
            ) : (
              <>
                <span className={styles.waitListCountWrapper}>{segmentedWaitList?.length}</span> in
                Waitlist
              </>
            )}
          </h3>
          <FilterBar
            waitlist={waitlist}
            segmentedWaitList={segmentedWaitList}
            updateSegmentedWaitList={updateSegmentedWaitList}
            setIsFilterActive={setIsFilterActive}
          />
          <div className={tableStyles.addTo}>
            <button
              className={styles.addButton}
              onClick={goToAddWaitListForm}
              data-test-id="button_addToWaitlist"
            >
              <Icon icon="plus" color="#3c444c" />
            </button>
          </div>
        </div>
        <ReactTable
          className={styles.waitlistTable}
          columns={columns}
          data={waitlistWithProps}
          pageSize={segmentedWaitList?.length}
          minRows={8}
          showPagination={false}
          resizable={false}
          defaultSorted={[
            {
              id: 'addedDate',
              desc: true,
            },
          ]}
          getTheadProps={() => ({
            style: theadStyles,
          })}
          getTheadThProps={(state, _, { id }) => {
            const { sorted } = state;
            const sortedStyle =
              sorted[0].id === id && sorted[0].desc ? styles.theadDesc : styles.theadAsc;
            const showSortedStyle = id === selectedColumn;
            const tHeadThStyles =
              id === 'waitSpotCheckbox'
                ? colHeaderStyle({ justifyContent: 'flex-end' })
                : colHeaderStyle();
            return {
              style: tHeadThStyles,
              className: showSortedStyle ? sortedStyle : null,
            };
          }}
          getTbodyProps={() => ({
            style: tbodyStyles,
          })}
          getTrProps={() => ({
            style: trStyles,
          })}
          onSortedChange={(prop) => {
            const { id } = prop[0];
            setSelectedColumn(id);
          }}
        />
        <WaitListTableFooter
          waitlistCount={selectedWaitlistIds.length}
          goToSendMassMessage={() => {
            goToSendMassMessage(selectedWaitlistIds);
          }}
          removeMultipleWaitSpots={() => removeMultipleWaitSpots({ ids: selectedWaitlistIds })}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ auth, entities }) => ({
  timezone: auth.get('timezone'),
  defaultUnit: entities.getIn(['accounts', 'models', auth.get('accountId')]).get('unit'),
});

export default memo(connect(mapStateToProps)(Index));

Index.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  selectedWaitlistMap: PropTypes.objectOf(PropTypes.bool).isRequired,
  removeMultipleWaitSpots: PropTypes.func.isRequired,
  setSelectedWaitlistMap: PropTypes.func.isRequired,
  goToSendMassMessage: PropTypes.func.isRequired,
  batchUpdate: PropTypes.func.isRequired,
  goToAddWaitListForm: PropTypes.func.isRequired,
  defaultUnit: PropTypes.number.isRequired,
};

Index.defaultProps = {
  waitlist: [],
};

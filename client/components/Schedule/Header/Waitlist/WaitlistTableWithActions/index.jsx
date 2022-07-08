import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { capitalize } from '../../../../../util/isomorphic';
import { Avatar, Checkbox, Icon, IconButton, getDate } from '../../../../library';
import Tooltip from '../../../../Tooltip';
import { propsGenerator } from '../helpers';
import FilterBar from './FilterBar';
import WaitListTableHeader from './WaitListTableHeader';
import WaitListTableFooter from './WaitListTableFooter';
import {
  theadStyles,
  colHeaderStyle,
  tbodyStyles,
  trStyles,
  trGrpStyles,
  pgStyles,
} from './tableStyles';
import tableStyles from '../tableStyles.scss';
import styles from './reskin-styles.scss';
import {
  FirstNameCell,
  LastNameCell,
  ManageCell,
  TimesCell,
  WaitSpotCheckboxCell,
  WaitspotNotesCell,
  DaysCell,
} from './cells';

const WaitlistTableWithActions = ({
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

  const segmentedWaitListIds = segmentedWaitList.map((waitSpot) => waitSpot.id);

  const isEveryWaitlistSelected =
    segmentedWaitList?.length > 0 && segmentedWaitList?.length === selectedWaitlistIds?.length;

  useEffect(() => {
    const waitlistIdsInView = selectedWaitlistIds.filter((id) => segmentedWaitListIds.includes(id));
    if (selectedWaitlistIds?.length > 0) {
      setSelectedWaitlistMap(batchUpdate(true, waitlistIdsInView));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentedWaitList]);

  const toggleAllWaitlistSelection = () => {
    setSelectedWaitlistMap(batchUpdate(!isEveryWaitlistSelected, segmentedWaitListIds));
  };

  const toggleSingleWaitlistSelection = (key) => {
    setSelectedWaitlistMap((prevState) => ({
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

    const availableTimes = spot.availableTimes.map((time) => getDate(time).toISOString());

    return {
      ...generatedProps,
      availableTimes,
    };
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
      accessor: (waitspot) => waitspot,
      Cell: WaitSpotCheckboxCell,
      sortable: false,
      width: 70,
    },
    {
      Header: 'DATE ADDED',
      accessor: 'addedDate', // String-based value accessors!
    },
    {
      id: 'userAvatar',
      sortable: false,
      maxWidth: 60,
      accessor: (waitspot) => waitspot,
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => value.patient && <Avatar user={value.patient} size="xs" />,
    },
    {
      id: 'firstName',
      Header: 'FIRST NAME',
      accessor: (waitspot) => waitspot,
      sortMethod: (a, b) =>
        sortHelper(a.patient.firstName.toLowerCase(), b.patient.firstName.toLowerCase()),
      Cell: FirstNameCell,
    },
    {
      id: 'lastName',
      Header: 'LAST NAME',
      accessor: (waitspot) => waitspot,
      sortMethod: (a, b) =>
        sortHelper(a.patient.lastName.toLowerCase(), b.patient.lastName.toLowerCase()),
      Cell: LastNameCell,
    },
    {
      id: 'reasonText',
      Header: 'REASON',
      accessor: (waitspot) => capitalize(waitspot.reasonText || ''),
    },
    {
      id: 'practitioners',
      Header: 'PRACTITIONERS',
      accessor: (waitspot) => capitalize(waitspot.practitioner?.firstName || ''),
    },
    {
      id: 'duration',
      Header: () => (
        <>
          UNITS{' '}
          <Tooltip body={<div>Units are in {defaultUnit}-minute intervals</div>} placement="above">
            <Icon icon="question-circle" size={0.9} />
          </Tooltip>
        </>
      ),
      accessor: (waitspot) => waitspot.duration || '',
    },
    {
      id: 'dates',
      Header: 'DAYS',
      accessor: (waitspot) => waitspot,
      sortMethod: (a, b) => sortHelper(a.dates, b.dates),
      Cell: DaysCell,
    },

    {
      id: 'times',
      Header: 'TIMES',
      accessor: (waitspot) => waitspot,
      sortMethod: (a, b) => sortHelper(a.availableTimes, b.availableTimes),
      Cell: TimesCell,
    },
    {
      Header: 'NEXT APPT',
      accessor: 'nextApptDate',
    },
    {
      id: 'waitspotNotes',
      Header: 'NOTES',
      sortMethod: (a, b) => sortHelper(a.note.toLowerCase(), b.note.toLowerCase()),
      accessor: (waitspot) => waitspot,
      Cell: WaitspotNotesCell,
    },
    {
      id: 'manage',
      Header: 'MANAGE',
      accessor: (waitspot) => waitspot,
      className: styles.manageCell,
      Cell: ManageCell,
      sortable: false,
    },
  ];

  return (
    <>
      <WaitListTableHeader
        exitFullScreen={parentProps.onOverlayClick}
        segmentedWaitList={segmentedWaitList}
        isFilterActive={isFilterActive}
        waitlist={waitlist}
      />
      <div className={tableStyles.waitList}>
        <div className={tableStyles.headerTable}>
          <FilterBar
            waitlist={waitlist}
            segmentedWaitList={segmentedWaitList}
            updateSegmentedWaitList={updateSegmentedWaitList}
            setIsFilterActive={setIsFilterActive}
          />
          <div className={styles.separator} />
          <div className={tableStyles.addTo}>
            <button
              type="button"
              className={styles.addButton}
              onClick={goToAddWaitListForm}
              data-test-id="button_addToWaitlist"
            >
              <Icon icon="plus" />
            </button>
          </div>
        </div>
        <ReactTable
          className={styles.waitlistTable}
          columns={columns}
          data={waitlistWithProps}
          pageSize={15}
          showPageSizeOptions={false}
          showPageJump
          resizable={false}
          PreviousComponent={(props) => {
            return (
              <IconButton icon="angle-left" className={styles.paginationComp} size={1} {...props} />
            );
          }}
          NextComponent={(props) => {
            return (
              <IconButton
                icon="angle-right"
                className={styles.paginationComp}
                size={1}
                {...props}
              />
            );
          }}
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
          getTrGroupProps={() => ({
            style: trGrpStyles,
          })}
          getTrProps={() => ({
            style: trStyles,
          })}
          getPaginationProps={() => {
            return {
              style: pgStyles,
            };
          }}
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

WaitlistTableWithActions.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  selectedWaitlistMap: PropTypes.objectOf(PropTypes.bool).isRequired,
  removeMultipleWaitSpots: PropTypes.func.isRequired,
  setSelectedWaitlistMap: PropTypes.func.isRequired,
  goToSendMassMessage: PropTypes.func.isRequired,
  batchUpdate: PropTypes.func.isRequired,
  goToAddWaitListForm: PropTypes.func.isRequired,
  defaultUnit: PropTypes.number.isRequired,
};

WaitlistTableWithActions.defaultProps = {
  waitlist: [],
};

const mapStateToProps = ({ auth }) => ({
  timezone: auth.get('timezone'),
  defaultUnit: auth.get('account').get('unit'),
});

export default memo(connect(mapStateToProps)(WaitlistTableWithActions));

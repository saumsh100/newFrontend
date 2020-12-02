
import React from 'react';
import PropTypes from 'prop-types';
import ChairHeader from './ChairHeader';
import PractitionerHeader from './PractitionerHeader';
import styles from './styles.scss';

export default function ShowColumnHeader(props) {
  const {
    scheduleView,
    entities,
    headerComponentDidMount,
    leftColumnWidth,
    minWidth,
    allFetched,
  } = props;

  const timeSlotContentStyle = {
    minWidth: `${minWidth}px`,
  };

  const emptyStyle = {
    width: leftColumnWidth,
    minWidth: leftColumnWidth,
  };

  return (
    <div className={styles.columnHeader}>
      <div className={styles.columnHeader_empty} style={emptyStyle}>
        {''}
      </div>
      <div className={styles.scrollDiv}>
        {allFetched ? (
          <div className={styles.columnHeader_body} ref={headerComponentDidMount}>
            {entities.map((entity, i) => {
              const key = i + Math.random();
              return (
                <div key={key} className={styles.columnHeader_item} style={timeSlotContentStyle}>
                  {scheduleView === 'chair' ? (
                    <ChairHeader chair={entity} />
                  ) : (
                    <PractitionerHeader practitioner={entity} />
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
        <div className={styles.blank} />
      </div>
    </div>
  );
}

ShowColumnHeader.propTypes = {
  scheduleView: PropTypes.string,
  entities: PropTypes.instanceOf(Array),
  headerComponentDidMount: PropTypes.shape({ current: PropTypes.any }),
  leftColumnWidth: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  allFetched: PropTypes.bool,
};

ShowColumnHeader.defaultProps = {
  scheduleView: null,
  entities: [],
  headerComponentDidMount: {},
  allFetched: false,
};

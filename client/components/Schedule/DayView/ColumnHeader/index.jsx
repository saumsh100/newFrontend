
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
  } = props;

  const columnWidth = entities.length < 5 ? 100 / entities.length : 30;

  const timeSlotContentStyle = {
    width: `${columnWidth}%`,
    minWidth: `${minWidth}px`,
  };

  return (
    <div className={styles.columnHeader} >
      <div className={styles.columnHeader_empty} style={{ width: leftColumnWidth, minWidth: leftColumnWidth }}>
        {''}
      </div>
      <div className={styles.columnHeader_body} ref={headerComponentDidMount}>
        {entities.map((entity, i) => {
          return (
            <div key={i + Math.random()} className={styles.columnHeader_item} style={timeSlotContentStyle}>
              {scheduleView === 'chair' ? <ChairHeader chair={entity} /> : <PractitionerHeader practitioner={entity} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}


ShowColumnHeader.propTypes = {
  scheduleView: PropTypes.string,
  entities: PropTypes.instanceOf(Array),
  headerComponentDidMount: PropTypes.func,
};

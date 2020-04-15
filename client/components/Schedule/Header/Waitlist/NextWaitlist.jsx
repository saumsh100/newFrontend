
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import WaitlistTableWithActions from './WaitlistTableWithActions';
import { batchUpdateFactory } from './helpers';

const NextWaitlist = ({ removeMultipleWaitSpots, ...props }) => {
  const batchUpdate = useCallback((state = false) => batchUpdateFactory(props.waitlist)(state), [
    props.waitlist,
  ]);
  const [selectedWaitlistMap, setSelectedWaitlistIds] = useState(batchUpdate);
  const waitlistLength = props.waitlist.length;
  const selectedWaitlistIds = Object.entries(selectedWaitlistMap)
    .filter(([, v]) => v)
    .map(([v]) => v);
  const selectedWaitlistLength = selectedWaitlistIds.length;
  const isEveryWaitlistSelected = waitlistLength > 0 && waitlistLength === selectedWaitlistLength;

  const toggleAllWaitlistSelection = () => {
    setSelectedWaitlistIds(batchUpdate(!isEveryWaitlistSelected));
  };
  const toggleSingleWaitlistSelection = (key) => {
    setSelectedWaitlistIds(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  useEffect(() => {
    setSelectedWaitlistIds(batchUpdate());
  }, [batchUpdate]);

  return (
    <WaitlistTableWithActions
      {...props}
      selectedWaitlist={selectedWaitlistMap}
      isAnyWaitlistSelected={selectedWaitlistLength > 0}
      isEveryWaitlistSelected={isEveryWaitlistSelected}
      removeMultipleWaitSpots={() => removeMultipleWaitSpots({ ids: selectedWaitlistIds })}
      toggleAllWaitlistSelection={toggleAllWaitlistSelection}
      toggleSingleWaitlistSelection={toggleSingleWaitlistSelection}
      setSelectedWaitlistIds={setSelectedWaitlistIds}
    />
  );
};

export default NextWaitlist;

NextWaitlist.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  removeMultipleWaitSpots: PropTypes.func.isRequired,
};

NextWaitlist.defaultProps = {
  waitlist: [],
};

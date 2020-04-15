
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import WaitlistTableWithActions from './WaitlistTableWithActions';
import { batchUpdateFactory } from './helpers';

const NextWaitlist = (props) => {
  const batchUpdate = batchUpdateFactory(props.waitlist);
  const [selectedWaitlistIds, setSelectedWaitlistIds] = useState(batchUpdate);
  const isEveryWaitlistSelected = Object.values(selectedWaitlistIds).every(v => v);

  const toggleAllWaitlistSelection = () => {
    setSelectedWaitlistIds(batchUpdate(!isEveryWaitlistSelected));
  };

  const toggleSingleWaitlistSelection = (key) => {
    setSelectedWaitlistIds(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <WaitlistTableWithActions
      {...props}
      selectedWaitlistIds={selectedWaitlistIds}
      isEveryWaitlistSelected={isEveryWaitlistSelected}
      toggleAllWaitlistSelection={toggleAllWaitlistSelection}
      toggleSingleWaitlistSelection={toggleSingleWaitlistSelection}
      setSelectedWaitlistIds={setSelectedWaitlistIds}
    />
  );
};

export default NextWaitlist;

NextWaitlist.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

NextWaitlist.defaultProps = {
  waitlist: [],
};

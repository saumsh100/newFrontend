
import React, { PropTypes } from 'react';
import { compose, withState } from 'recompose';

import NavRegion from '../components/NavRegion';
import NavList from '../components/NavList';
import MainRegion from '../components/MainRegion';

function App({ location, children }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <NavRegion>
        <NavList location={location} />
      </NavRegion>
      <MainRegion>
        {children}
      </MainRegion>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

const enhance = compose(
  // withState('isActive', 'setIsActive', false)
);

export default enhance(App);


import React, { PropTypes } from 'react';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router';
import Button from '../Button';

function RouterButton(props) {
  return <Button {...props} />;
}

RouterButton.propTypes = {
  to: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
};

const withOnClick = withHandlers({
  onClick: ({ router, to }) => (e) => {
    if (e.preventDefault) e.preventDefault();
    router.push(to);
  },
});

const enhance = compose(withRouter, withOnClick);

export default enhance(RouterButton);

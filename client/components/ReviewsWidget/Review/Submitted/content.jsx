
import React, { Component, PropTypes } from 'react';

export default {
  // If less than 4 stars
  sorry: {
    header: (
      <div>
        Thanks for being honest!
      </div>
    ),

    response: (
      <div>
        Your feedback is important to us. Please
        share your experience to help us improve.
      </div>
    ),
  },

  // If 4 stars or greater
  grateful: {
    header: (
      <div>
        Thanks!<br/>
        We appreciate you too.
      </div>
    ),

    response: (
      <div>
        Reviews are important to us to help
        grow our practice. Please take a
        minute to leave us a Google review.
      </div>
    ),
  },
};

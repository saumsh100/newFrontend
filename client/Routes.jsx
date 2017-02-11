
import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './containers/App';
import FourZeroFour from './components/FourZeroFour';

let counter = 0;

function onError(error) {
  console.log('router error', error);
}

export default function Routes({ history }) {
  return (
    <Router
      history={history}
      key={counter}
      onError={onError}
    >
      <Route path="/" component={App}>
        <IndexRedirect to="/schedule" />
        <Route
          path="login"
          getComponent={(location, callback) => {
            require.ensure(['./components/Login'], (require) => {
              callback(null, require('./components/Login').default);
            });
          }}
        />
        <IndexRoute
          getComponent={(location, callback) => {
            require.ensure(['./components/Dashboard'], (require) => {
              callback(null, require('./components/Dashboard').default);
            });
          }}
        />
        <Route
          path="intelligence"
          getComponent={(location, callback) => {
            require.ensure(['./containers/IntelligenceContainer'], (require) => {
              callback(null, require('./containers/IntelligenceContainer').default);
            });
          }}
        />
        <Route
          path="schedule"
          getComponent={(location, callback) => {
            require.ensure(['./components/Schedule'], (require) => {
              callback(null, require('./components/Schedule').default);
            });
          }}
        >
          <IndexRedirect to="calendar" />
          <Route
            path="calendar"
            getComponent={(location, callback) => {
              require.ensure(['./components/Schedule/DayView'], (require) => {
                callback(null, require('./components/Schedule/DayView').default);
              });
            }}
          />
          {/*<Route
            path="appointments"
            getComponent={(location, callback) => {
              require.ensure(['./components/Schedule/MonthView'], (require) => {
                callback(null, require('./components/Schedule/MonthView').default);
              });
            }}
          />*/}
        </Route>
        <Route
          path="patients"
          getComponent={(location, callback) => {
            require.ensure(['./containers/PatientsContainer'], (require) => {
              callback(null, require('./containers/PatientsContainer').default);
            });
          }}
        >
          <IndexRedirect to="list" />
          <Route
            path="list"
            getComponent={(location, callback) => {
              require.ensure(['./containers/PatientsListContainer'], (require) => {
                callback(null, require('./containers/PatientsListContainer').default);
              });
            }}
          />
          <Route
            path="messages"
            getComponent={(location, callback) => {
              require.ensure(['./containers/PatientsMessagesContainer'], (require) => {
                callback(null, require('./containers/PatientsMessagesContainer').default);
              });
            }}
          />
          {/*<Route
            path="phone"
            getComponent={(location, callback) => {
              require.ensure(['./containers/PatientsPhoneContainer'], (require) => {
                callback(null, require('./containers/PatientsPhoneContainer').default);
              });
            }}
          />*/}
        </Route>
        {/*<Route
          path="reputation"
          getComponent={(location, callback) => {
            require.ensure(['./components/Vendasta'], (require) => {
              callback(null, require('./components/Vendasta').default);
            });
          }}
        />
        <Route
          path="social"
          getComponent={(location, callback) => {
            require.ensure(['./containers/AccountContainer'], (require) => {
              callback(null, require('./containers/AccountContainer').default);
            });
          }}
        />
        <Route
          path="loyalty"
          getComponent={(location, callback) => {
            require.ensure(['./containers/AccountContainer'], (require) => {
              callback(null, require('./containers/AccountContainer').default);
            });
          }}
        />
        <Route
          path="newsletters"
          getComponent={(location, callback) => {
            require.ensure(['./containers/AccountContainer'], (require) => {
              callback(null, require('./containers/AccountContainer').default);
            });
          }}
        />
        <Route
          path="website"
          getComponent={(location, callback) => {
            require.ensure(['./containers/AccountContainer'], (require) => {
              callback(null, require('./containers/AccountContainer').default);
            });
          }}
        />
        <Route
          path="roadmap"
          getComponent={(location, callback) => {
            require.ensure(['./containers/AccountContainer'], (require) => {
              callback(null, require('./containers/AccountContainer').default);
            });
          }}
        />*/}
        <Route
          path="settings"
          getComponent={(location, callback) => {
            require.ensure(['./containers/AccountContainer'], (require) => {
              callback(null, require('./containers/AccountContainer').default);
            });
          }}
        />
        <Route
          path="profile"
          getComponent={(location, callback) => {
            require.ensure(['./components/Profile'], (require) => {
              callback(null, require('./components/Profile').default);
            });
          }}
        />
        <Route
          path="dayview"
          getComponent={(location, callback) => {
            require.ensure(['./components/Schedule/DayView'], (require) => {
              callback(null, require('./components/Schedule/DayView').default);
            });
          }}
        />

        <Route path="*" component={FourZeroFour} />
      </Route>
    </Router>
  );
}

if (module.hot) {
  counter++;
  module.hot.accept();
}

Routes.propTypes = {
  history: PropTypes.object.isRequired,
};



import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from './containers/App';

let counter = 0;
export default function Routes({ history }) {
  return (
    <Router history={history} key={counter}>
      <Route path="/" component={App}>
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
        />
        <Route
          path="login"
          getComponent={(location, callback) => {
            require.ensure(['./components/Login'], (require) => {
              callback(null, require('./components/Login').default);
            });
          }}
        />
        <Route
          path="patients"
          getComponent={(location, callback) => {
            require.ensure(['./containers/PatientsContainer'], (require) => {
              callback(null, require('./containers/PatientsContainer').default);
            });
          }}
        >
          <IndexRoute
            getComponent={(location, callback) => {
              require.ensure(['./components/Patients'], (require) => {
                callback(null, require('./components/Patients').default);
              });
            }}
          />
          <Route
            path=":patientId"
            getComponent={(location, callback) => {
              require.ensure(['./containers/PatientShowContainer'], (require) => {
                callback(null, require('./containers/PatientShowContainer').default);
              });
            }}
          />
        </Route>
        <Route
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
        />
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


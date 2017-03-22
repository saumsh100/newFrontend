
import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router';
import DashboardApp from '../containers/DashboardApp';
import FourZeroFour from '../components/FourZeroFour';

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
      <Route path="/" component={DashboardApp}>
        <IndexRedirect to="/schedule" />
        <Route
          path="login"
          getComponent={(location, callback) => {
            require.ensure(['../components/Login'], (require) => {
              callback(null, require('../components/Login/index').default);
            });
          }}
        />
        <IndexRoute
          getComponent={(location, callback) => {
            require.ensure(['../components/Dashboard'], (require) => {
              callback(null, require('../components/Dashboard/index').default);
            });
          }}
        />


        <Route
          path="intelligence"
          getComponent={(location, callback) => {
            require.ensure(['../containers/IntelligenceContainer'], (require) => {
              callback(null, require('../containers/IntelligenceContainer').default);
            });
          }}>
          <Route
            path="overview"
            getComponent={(location, callback) => {
              require.ensure(['../components/IntelligenceComponent'], (require) => {
                callback(null, require('../components/IntelligenceComponent').default);
              });
            }}
          />
          <Route
            path="business"
            getComponent={(location, callback) => {
              require.ensure(['../components/IntelligenceComponent/Business'], (require) => {
                callback(null, require('../components/IntelligenceComponent/Business').default);
              });
            }}
          />
          <Route
            path="social"
            getComponent={(location, callback) => {
              require.ensure(['../components/IntelligenceComponent/Social'], (require) => {
                callback(null, require('../components/IntelligenceComponent/Social').default);
              });
            }}
          />
        </Route>
        <Route
          path="business"
          getComponent={(location, callback) => {
            require.ensure(['../components/IntelligenceComponent/Business'], (require) => {
              callback(null, require('../components/IntelligenceComponent/Business').default);
            });
          }} />

        <Route
          path="availabilities"
          getComponent={(location, callback) => {
            require.ensure(['../containers/AvailabilityContainer'], (require) => {
              callback(null, require('../containers/AvailabilityContainer').default);
            });
          }}
        />
        <Route
          path="schedule"
          getComponent={(location, callback) => {
            require.ensure(['../containers/ScheduleContainer'], (require) => {
              callback(null, require('../containers/ScheduleContainer').default);
            });
          }}
        >
          <IndexRedirect to="calendar" />
          <Route
            path="calendar"
            getComponent={(location, callback) => {
              require.ensure(['../components/Schedule/DayView'], (require) => {
                callback(null, require('../components/Schedule/DayView/index').default);
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
            require.ensure(['../containers/PatientsContainer'], (require) => {
              callback(null, require('../containers/PatientsContainer').default);
            });
          }}
        >
          <IndexRedirect to="list" />
          <Route
            path="list"
            getComponent={(location, callback) => {
              require.ensure(['../containers/PatientsListContainer'], (require) => {
                callback(null, require('../containers/PatientsListContainer').default);
              });
            }}
          />
          <Route
            path="messages"
            getComponent={(location, callback) => {
              require.ensure(['../containers/PatientsMessagesContainer'], (require) => {
                callback(null, require('../containers/PatientsMessagesContainer').default);
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
            require.ensure(['../containers/SettingsContainer'], (require) => {
              callback(null, require('../containers/SettingsContainer').default);
            });
          }}
        >
          <IndexRedirect to="clinic" />
          <Route
            path="clinic"
            getComponent={(location, callback) => {
              require.ensure(['../components/Settings/Clinic'], (require) => {
                callback(null, require('../components/Settings/Clinic').default);
              });
            }}
          >
            <IndexRedirect to="general" />
            <Route
              path="general"
              getComponent={(location, callback) => {
                require.ensure(['../components/Settings/Clinic/General'], (require) => {
                  callback(null, require('../components/Settings/Clinic/General').default);
                });
              }}
            />
            <Route
              path="users"
              getComponent={(location, callback) => {
                require.ensure(['../components/Settings/Clinic/CareCruUsers'], (require) => {
                  callback(null, require('../components/Settings/Clinic/CareCruUsers').default);
                });
              }}
            />
          </Route>
          <Route
            path="schedule"
            getComponent={(location, callback) => {
              require.ensure(['../components/Settings/Schedule'], (require) => {
                callback(null, require('../components/Settings/Schedule').default);
              });
            }}
          >
            <IndexRedirect to="hours" />
            <Route
              path="hours"
              getComponent={(location, callback) => {
                require.ensure(['../components/Settings/Schedule/OfficeHours'], (require) => {
                  callback(null, require('../components/Settings/Schedule/OfficeHours').default);
                });
              }}
            />
          </Route>
          <Route
            path="services"
            getComponent={(location, callback) => {
              require.ensure(['../components/Settings/Services/'], (require) =>{
                callback(null, require('../components/Settings/Services/').default);
              });
            }}
          />
          <Route
            path="practitioners"
            getComponent={(location, callback) => {
              require.ensure(['../components/Settings/Practitioners/'], (require) =>{
                callback(null, require('../components/Settings/Practitioners/').default);
              });
            }}
          />
        </Route>
        <Route
          path="profile"
          getComponent={(location, callback) => {
            require.ensure(['../components/Profile'], (require) => {
              callback(null, require('../components/Profile/index').default);
            });
          }}
        />
        <Route
          path="dayview"
          getComponent={(location, callback) => {
            require.ensure(['../components/Schedule/DayView'], (require) => {
              callback(null, require('../components/Schedule/DayView/index').default);
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

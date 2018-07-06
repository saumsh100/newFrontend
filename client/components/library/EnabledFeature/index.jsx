
import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';

/**
 * This component is intended to wrap the necessary logic to render or not a
 * component based on a predicate function.
 *
 * The predicate function must return a boolean value. Based on its return one of
 * each render prop will be called:
 *  if predicate returns true: render() is called
 *  if predicate returns false: fallback() is called
 *  *
 * The predicate function receives by default a subject object containing:
 *  adapterPermissions - adapter specific permissions, set in the auth reducer
 *  flags - feature flags, set in the featureFlags reducer
 *  userRole - role property of the user model, set in the auth reducer
 * Both render props also receive the subject object as a parameter
 *
 * Any property of the subject object can be overriden by a component property of same name.
 * It is possibile to override individual properties.
 *
 * @example Render a component based on feature flag status
 * <EnabledFeature
 *  predicate={({ flags }) => myNewFeature.get('myNewFeature')}
 *  render={() => <h1> myNewFeature is enabled </h1>}
 * />
 *
 * @example Render different components based on user role
 * <EnabledFeature
 *  predicate={({ userRole }) => userRole === 'SUPERADMIN'}
 *  render={() => <SuperAdminPage>}
 *  render={() => <RegularUserPage>}
 * />
 *
 * @example Render a component based on combined test
 * <EnabledFeature
 *  predicate={({ userRole, adapterPermissions }) =>
 *    userRole === 'MANAGER' && adapterPermissions.get('can-update-appointment')
 *  }
 *  render={() => <UpdateAppointmentButton>}
 * />
 *
 * @param {object || immutable.Map} props.adapterPermissions
 * @param {function || component} props.fallback
 * @param {object || immutable.Map} props.flags
 * @param {function} props.predicate
 * @param {function || component} props.render
 * @param {object} props.subject
 * @param {string} props.userRole
 */
function EnabledFeature(props) {
  const {
    predicate, subject, render, fallback,
  } = props;

  if (predicate(subject)) {
    return renderFunctionOrComponent(render, subject);
  }

  return renderFunctionOrComponent(fallback, subject);
}

const renderFunctionOrComponent = (functionOrComponent, newProps = {}) =>
  (typeof functionOrComponent === 'function'
    ? functionOrComponent(newProps)
    : cloneElement(functionOrComponent, newProps));

function mapStateToProps({ featureFlags, auth }, { flags, adapterPermissions, userRole }) {
  return {
    subject: {
      adapterPermissions: adapterPermissions || auth.get('adapterPermissions'),
      flags: flags || featureFlags.get('flags'),
      userRole: userRole || auth.get('role'),
    },
  };
}

EnabledFeature.propTypes = {
  adapterPermissions: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.bool),
    PropTypes.instanceOf(Map),
  ]),
  fallback: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  flags: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.bool), PropTypes.instanceOf(Map)]),
  predicate: PropTypes.func.isRequired,
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  subject: PropTypes.shape({
    adapterPermissions: PropTypes.instanceOf(Map),
    flags: PropTypes.instanceOf(Map),
    userRole: PropTypes.string,
  }),
  userRole: PropTypes.string,
};

EnabledFeature.defaultProps = {
  flags: null,
  adapterPermissions: null,
  role: null,
  fallback: () => null,
};

export default connect(
  mapStateToProps,
  null,
)(EnabledFeature);

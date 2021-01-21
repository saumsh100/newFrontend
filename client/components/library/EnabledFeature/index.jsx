
import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { nonApptWritePMS } from '../util/nonApptWritePMS';

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
 * @param {object|immutable.Map} props.adapterPermissions
 * @param {function|component} props.fallback
 * @param {object|immutable.Map} props.flags
 * @param {function} props.predicate
 * @param {function|component} props.render
 * @param {boolean} props.renderBeforeFlags if true, don't wait for feature flags
 *  to load always rendering the fallback first
 * @param {object} props.subject
 * @param {string} props.userRole
 * @param {boolean} props.drillProps
 */
function EnabledFeature({
  predicate,
  subject,
  render,
  renderBeforeFlags,
  fallback,
  drillProps = true,
}) {
  const flagsSize = Map.isMap(subject.flags)
    ? subject.flags.size
    : Object.values(subject.flags).length;

  if (!renderBeforeFlags && flagsSize === 0) {
    return null;
  }

  return renderFunctionOrComponent(
    predicate(subject) ? render : fallback,
    drillProps ? subject : undefined,
  );
}

/**
 * This function decides the proper way of rendering what is passed on functionOrComponent.
 * This is meant to be used on render props that need to support both functions and components.
 *
 * Function will be called with the newProps as args.
 * Components will be cloned and the newProps will be passed down to it.
 *
 * @param {function|component} functionOrComponent
 * @param {object} newProps
 */
function renderFunctionOrComponent(functionOrComponent, newProps = {}) {
  return typeof functionOrComponent === 'function'
    ? functionOrComponent(newProps)
    : cloneElement(functionOrComponent, newProps);
}

function mapStateToProps({ featureFlags, auth }, { flags, adapterPermissions, userRole }) {
  return {
    subject: {
      adapterPermissions: adapterPermissions || auth.get('adapterPermissions'),
      flags: flags || featureFlags.get('flags'),
      flagsLoaded: featureFlags.get('flagsLoaded'),
      userRole: userRole || auth.get('role'),
      noAppointmentWrite: nonApptWritePMS(auth.get('adapterType')),
    },
  };
}

const objectOrMapPropType = PropTypes.oneOfType([
  PropTypes.objectOf(PropTypes.bool),
  PropTypes.instanceOf(Map),
]);

const functionOrNodePropType = PropTypes.oneOfType([PropTypes.func, PropTypes.node]);

EnabledFeature.propTypes = {
  adapterPermissions: objectOrMapPropType,
  fallback: functionOrNodePropType,
  flags: objectOrMapPropType,
  predicate: PropTypes.func.isRequired,
  render: functionOrNodePropType.isRequired,
  renderBeforeFlags: PropTypes.bool,
  subject: PropTypes.shape({
    adapterPermissions: objectOrMapPropType,
    flags: objectOrMapPropType,
    userRole: PropTypes.string,
  }),
  userRole: PropTypes.string,
};

EnabledFeature.defaultProps = {
  flags: null,
  adapterPermissions: null,
  renderBeforeFlags: false,
  role: null,
  fallback: () => null,
};

export default connect(mapStateToProps, null)(EnabledFeature);

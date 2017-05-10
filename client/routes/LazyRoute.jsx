import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Bundle from './Bundle';

const Loading = () =>
  <div>Loading</div>;

const LazyRoute = ({ path, load, component = null }) => {
  const bundleComponent = props =>
    <Bundle load={load}>
      {((Module) => {
        const renderModule = () =>
          (component
            ? <Module {...props}>{React.createElement(component, props)}</Module>
            : <Module {...props} />);

        return Module
          ? renderModule()
          : <Loading />;
      })}
    </Bundle>;

  return <Route path={path} component={bundleComponent} />;
};

LazyRoute.propTypes = {
  path: PropTypes.string.required,
  load: PropTypes.func.required,
  component: PropTypes.element,
};

export default LazyRoute;

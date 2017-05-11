import React, { PropTypes } from 'react';
import { Route } from 'react-router-dom';
import Bundle from './Bundle';

const Loading = () =>
  <div>Loading</div>;

const LazyRoute = ({ path, load, component = null, name = '' }) => {
  const bundleComponent = props =>
    <Bundle load={load} name={name}>
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
  path: PropTypes.string.isRequired,
  name: PropTypes.string,
  load: PropTypes.func.isRequired,
  component: PropTypes.element,
};

export default LazyRoute;

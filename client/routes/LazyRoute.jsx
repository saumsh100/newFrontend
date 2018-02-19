
import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { Route } from 'react-router-dom';
import Bundle from './Bundle';

const Loading = () =>
  <Loader loaded={false} color="#FF715A" />;

const LazyRoute = ({ path, load, component = null, name = '', disableLoader }) => {
  const bundleComponent = props =>
    <Bundle load={load} name={name}>
      {((Module) => {
        const renderModule = () =>
          (component
            ? <Module {...props}>{React.createElement(component, props)}</Module>
            : <Module {...props} />);

        return Module
          ? renderModule()
          : !disableLoader ? <Loading /> : null;
      })}
    </Bundle>;

  return <Route path={path} component={bundleComponent} />;
};

LazyRoute.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string,
  load: PropTypes.func.isRequired,
  component: PropTypes.element,
  disableLoader: PropTypes.bool,
};

export default LazyRoute;


import React from 'react';
import Loadable from 'react-loadable';
import Loader from '../components/Loader';

export default (componentLoader, hideLoader = false) => {
  const loaderData = {
    loader: componentLoader,
    loading: () => {
      if (hideLoader) {
          return null;
      }
      return <Loader inContainer={true} />;
    }
  };

  return Loadable(loaderData);
}

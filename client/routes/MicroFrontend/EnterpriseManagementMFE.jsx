/* eslint-disable import/no-unresolved */
import React, { lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

const Home = lazy(() => import('EM_MFE/Home'));
import('EM_MFE/styles');

const EnterpriseManagementMFE = () => (
  <React.Suspense fallback="Loading Micro FrontEnd">
    <div className="mfe-container">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Home />
      </ErrorBoundary>
    </div>
  </React.Suspense>
);

export default EnterpriseManagementMFE;

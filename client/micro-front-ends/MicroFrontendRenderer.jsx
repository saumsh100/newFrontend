import React, { Suspense } from 'react';
import Proptypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

const styles = {
  display: 'flex',
  justifyContent: 'center',
  fontSize: '8px',
  lineHeight: '10px',
  color: '#eee',
  textShadow: '#000 1px 1px 1px',
  padding: '4px',
};
const ErrorFallback = () => {
  return <div style={styles}>Failed to load component</div>;
};

const MicroFrontendRenderer = ({ component, errorFallback, fallbackMessage, load }) => {
  return (
    load && (
      <Suspense fallback={fallbackMessage}>
        <ErrorBoundary FallbackComponent={errorFallback}>{component}</ErrorBoundary>
      </Suspense>
    )
  );
};

MicroFrontendRenderer.defaultProps = {
  load: false,
  fallbackMessage: 'Loading...',
  errorFallback: ErrorFallback,
};

MicroFrontendRenderer.propTypes = {
  load: Proptypes.bool,
  fallbackMessage: Proptypes.string,
  errorFallback: Proptypes.func,
  component: Proptypes.element.isRequired,
};

export default MicroFrontendRenderer;

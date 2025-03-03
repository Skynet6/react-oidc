import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NotAuthenticated, NotAuthorized } from '../default-component';
import { getPath } from './route-utils';
import { SilentCallback } from '../callbacks';

const propTypes = {
  notAuthenticated: PropTypes.elementType,
  notAuthorized: PropTypes.elementType,
  callbackComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  configuration: PropTypes.shape({
    redirect_uri: PropTypes.string.isRequired,
    silent_redirect_uri: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

const defaultProps = {
  notAuthenticated: null,
  notAuthorized: null,
  children: null,
};

const OidcRoutes = ({
  notAuthenticated,
  notAuthorized,
  callbackComponent: CallbackComponent,
  configuration,
  children,
}) => {
  const [path, setPath] = useState(window.location.pathname);

  const setNewPath = () => setPath(window.location.pathname);
  useEffect(() => {
    setNewPath();
    window.addEventListener('popstate', setNewPath, false);
    return () => window.removeEventListener('popstate', setNewPath, false);
  });

  const NotAuthenticatedComponent = notAuthenticated || NotAuthenticated;
  const NotAuthorizedComponent = notAuthorized || NotAuthorized;
  const silentCallbackPath = getPath(configuration.silent_redirect_uri);
  const callbackPath = getPath(configuration.redirect_uri);

  switch (path) {
    case callbackPath:
      return <CallbackComponent />;
    case silentCallbackPath:
      return <SilentCallback />;
    case '/authentication/not-authenticated':
      return <NotAuthenticatedComponent />;
    case '/authentication/not-authorized':
      return <NotAuthorizedComponent />;
    default:
      return <>{children}</>;
  }
};

OidcRoutes.propTypes = propTypes;
OidcRoutes.defaultProps = defaultProps;

export default React.memo(OidcRoutes);

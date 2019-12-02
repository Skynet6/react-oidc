import React from 'react';
import { OidcProvider, loadUser } from 'redux-oidc';
import { compose, lifecycle } from 'recompose';
import PropTypes from 'prop-types';
import { OidcRoutes, authenticationService, getUserManager, configurationPropTypes } from '@axa-fr/react-oidc-core';
import AuthenticationCallback from './AuthenticationCallback';

const propTypes = {
  notAuthenticated: PropTypes.elementType,
  notAuthorized: PropTypes.elementType,
  // eslint-disable-next-line react/require-default-props
  configuration: configurationPropTypes,
  store: PropTypes.object.isRequired,
  isEnabled: PropTypes.bool,
  children: PropTypes.node,
  callbackComponentOverride: PropTypes.elementType,
  authenticatingComponentOverride: PropTypes.elementType,
};

const defaultPropsObject = {
  notAuthenticated: null,
  notAuthorized: null,
  isEnabled: true,
  children: null,
  callbackComponentOverride: null,
  authenticatingComponentOverride: null,
};

const withComponentOverrideProps = (Component, customProps, customAuthentication) => props => (
  <Component callbackComponentOverride={customProps} authenticatingComponentOverride={customAuthentication} {...props} />
);

export const OidcBase = props => {
  const {
    isEnabled,
    children,
    store,
    callbackComponentOverride,
    configuration,
    notAuthenticated,
    notAuthorized,
    authenticatingComponentOverride,
  } = props;

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <OidcProvider store={store} userManager={getUserManager()}>
      <OidcRoutes
        configuration={configuration}
        notAuthenticated={notAuthenticated}
        notAuthorized={notAuthorized}
        callbackComponent={withComponentOverrideProps(
          AuthenticationCallback,
          callbackComponentOverride,
          authenticatingComponentOverride
        )}
      >
        {children}
      </OidcRoutes>
    </OidcProvider>
  );
};

OidcBase.propTypes = propTypes;
OidcBase.defaultProps = defaultPropsObject;

const lifecycleComponent = {
  UNSAFE_componentWillMount() {
    const { isEnabled, store, configuration } = this.props;
    if (isEnabled) {
      const userManager = authenticationService(configuration);
      loadUser(store, userManager);
    }
  },
};

const enhance = compose(lifecycle(lifecycleComponent));

export default enhance(OidcBase);

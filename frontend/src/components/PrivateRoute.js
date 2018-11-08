import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, user, token, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated ? (
      <Component user={user} token={token} {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    )
  )} />
)

export default PrivateRoute;
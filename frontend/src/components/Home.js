import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PollList from './PollList';
import PollDetail from './PollDetail';
import UserPolls from './UserPolls';
import PrivateRoute from './PrivateRoute';

class Home extends Component {

  render() {
    const { match, isAuthenticated, user, token } = this.props;
    const authProps = { isAuthenticated, user, token };

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">Voting App</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              { isAuthenticated ? (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <FontAwesomeIcon icon="user-circle" /> {user.username}
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                      <Link className="dropdown-item" to={`/profile/${user.username}/polls`}>
                        <FontAwesomeIcon icon="poll" /> My poll</Link>
                      <div className="dropdown-divider"></div>
                      <Link className="dropdown-item" to="/logout">
                        <FontAwesomeIcon icon="sign-out-alt" /> Log out</Link>
                    </div>
                  </li>
                </ul>
                ) : (
                <form className="form-inline ml-auto">
                  <Link className="btn btn-outline-secondary " to="/login">Log in</Link>
                  <Link className="btn btn-primary ml-2" to="/signup">Sign up</Link>
                </form>
                )
              }
            </div>
          </div>
        </nav>

        <main className="container">
          <div className="py-3">
            <Route exact path={`${match.url}`} render={(props) => (
              <Redirect to={`${match.url}polls`} />
            )} />
            <Route exact path={`${match.url}polls`} component={PollList} />
            <Route exact path={`${match.url}polls/:pollId`} render={(props) => (
              <PollDetail {...props} {...authProps} />
            )}/>
            <PrivateRoute exact path={`${match.url}profile/:username/polls`}
                          component={UserPolls}
                          {...authProps}/>
            {/* Not working as intended
            <Route render={() => (
              <h3 className="text-center">404 page not found</h3>
            )} /> */}
          </div>
        </main>

        <footer className="text-center text-light bg-dark py-4"></footer>
      </React.Fragment>
    );
  }
}

export default Home;
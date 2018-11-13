import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMinus,
         faSignOutAlt,
         faUserCircle,
         faCircleNotch,
         faPoll } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';

import './static/styles/custom.css';

library.add(faMinus, faSignOutAlt, faUserCircle, faCircleNotch, faPoll);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
      token: null
    }

    this.loggedIn = this.loggedIn.bind(this);
    this.loggedOut = this.loggedOut.bind(this);
  }

  loggedIn(token) {
    const userEndpoint = 'http://127.0.0.1:8000/rest-auth/user/'
    const conf = {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      })
    }
    fetch(userEndpoint, conf)
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(user => {
        const auth = JSON.stringify({ token });
        localStorage.setItem('auth', auth);
        this.setState({
          isAuthenticated: true, user, token
        });
      })
      .catch(errorData => {
        if (errorData instanceof Promise) {
          errorData.then(errors => console.log(errors));
        } else {
          console.log(errorData.message);
        }
      });
  }

  loggedOut() {
    localStorage.removeItem('auth');
    this.setState({...initialState});
  }

  componentDidMount() {
    const auth  = localStorage.getItem('auth');
    if (auth) {
      const { token } = JSON.parse(auth);
      this.loggedIn(token);
    }
  }

  render() {
    // const { token } = this.state;
    // console.log('token: ' + token);

    return (
      <BrowserRouter>
        <Switch>
          {/*<Route exact path="/" render={() => <Redirect to="/polls" />} />
          <Route path="/polls" component={Home} />*/}
          <Route path="/signup" render={(props) => (
            <SignUpForm endpoint='http://127.0.0.1:8000/rest-auth/registration/'
                        loggedInCallback={this.loggedIn}
                        {...this.state}
                        {...props} />
          )} />
          <Route path="/login" render={(props) => (
            <LoginForm endpoint='http://127.0.0.1:8000/rest-auth/login/'
                       loggedInCallback={this.loggedIn}
                       {...this.state}
                       {...props}/>
          )} />
          <Route path="/logout" render={(props) => (
            <Logout endpoint='http://127.0.0.1:8000/rest-auth/logout/'
                    loggedOutCallback={this.loggedOut}
                    {...this.state}
                    {...props} />
          )} />
          <Route path="/" render={(props) => (
            <Home {...this.state} {...props} />
          )}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Logout extends Component {
  state = {
    successLogout: false
  };

  componentDidMount() {
    const { endpoint, isAuthenticated, token, loggedOutCallback } = this.props;
    if (isAuthenticated) {
      const conf = {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        })
      }
      fetch(endpoint, conf)
        .then(response => {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then(successData => {
          loggedOutCallback();
          this.setState({ successLogout: true });
        })
        .catch(errorData => {
          if (errorData instanceof Promise) {
            errorData.then(errors => console.log(errors));
          } else {
            console.log(errorData);
          }
        });
    }
  }

  render() {
    const { successLogout } = this.state;
    return (
      <div>
        { successLogout
          ? <Redirect to="/" />
          : <p className="text-center">
              Logging out... <FontAwesomeIcon icon="circle-notch" />
            </p>
        }
      </div>
    );
  }
}

export default Logout;
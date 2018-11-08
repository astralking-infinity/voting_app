import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: undefined,
      password: '',
      errors: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const { username, password, email } = this.state;
    const { endpoint, loggedInCallback } = this.props;
    const loginAuth = { username, password, email };
    const conf = {
      method: 'post',
      body: JSON.stringify(loginAuth),
      headers: new Headers({ 'Content-Type': 'application/json' })
    };
    fetch(endpoint, conf)
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(successData => {
        if ('key' in successData) {
          loggedInCallback(successData.key);
        } else {
          console.log('Something went wrong:');
          console.log(successData);
        }
      })
      .catch(errorData => {
        if (errorData instanceof Promise) {
          errorData.then(errors => this.setState({ errors }));
        } else {
          this.setState({
            errors: {
              detail: [errorData.message]
            }
          });
        }
      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  render() {
    const { username, password, errors } = this.state;
    const { isAuthenticated } = this.props
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    // console.log(this);
    // console.log(from);

    return (
      <React.Fragment>
        {isAuthenticated ? (
          <Redirect to={from.pathname} />
        ) : (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 col-sm-8 py-3">
                <div className="card">
                  <div className="card-header text-center">
                    <h2>
                      <Link className="card-link" to="/">Voting App</Link>
                    </h2>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">Log in</h3>
                    <form onSubmit={this.handleFormSubmit}>
                      { errors && ('non_field_errors' in errors) ?
                        <div className="alert alert-danger" role="alert">
                          {errors.non_field_errors}
                        </div> : ""
                      }
                      <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input id="username"
                               type="text"
                               name="username"
                               className={`form-control ${errors && ('username' in errors) ? "is-invalid" : ""}`}
                               onChange={this.handleChange}
                               value={username}
                               required />
                        { errors && ('username' in errors) ?
                          errors.username.map((error, idx) => (
                            <div className="invalid-feedback" key={idx}>
                              {error}
                            </div> ))
                          : ""
                        }
                      </div>
                      <div className="form-group">
                        <label htmlFor="passowrd">Password:</label>
                        <input id="password"
                               type="password"
                               name="password"
                               className={`form-control ${errors && ('password' in errors) ? "is-invalid" : ""}`}
                               onChange={this.handleChange}
                               value={password}
                               autoComplete="off"
                               required />
                        { errors && ('password' in errors) ?
                          errors.password.map((error, idx) => (
                            <div className="invalid-feedback" key={idx}>
                              {error}
                            </div> ))
                          : ""
                        }
                      </div>
                      <button type="submit" className="btn btn-primary btn-block">Log in</button>
                    </form>
                  </div>
                  <div className="card-footer text-center text-muted">
                    Don't have an account yet? <Link to="/signup">Sign up</Link>
                  </div>
                </div>
                {/*
                <div className="text-center py-2">
                  <Link to="#">Forgot your password?</Link>
                </div>
                */}
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default LoginForm;
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class SignUpForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: undefined,
      password1: '',
      password2: '',
      errors: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // It's time to centralize the signup and login forms
  handleFormSubmit(event) {
    event.preventDefault();
    const { username, email, password1, password2 } = this.state;
    const signupAuth = { username, email, password1, password2 };
    const conf = {
      method: 'post',
      body: JSON.stringify(signupAuth),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }
    fetch(this.props.endpoint, conf)
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(successData => {
        if ('key' in successData) {
          this.props.loggedInCallback(successData.key)
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
    const { username, email, password1, password2, errors } = this.state;
    const { isAuthenticated } = this.props;

    return (
      <React.Fragment>
        {isAuthenticated ? (
          <Redirect to="/" />
        ) : (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 col-sm-12 py-3">
                <div className="card">
                  <div className="card-header text-center">
                    <h2>
                      <Link to="/" className="card-link">Voting App</Link>
                    </h2>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">Sign up</h3>
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
                      {/* Email verification not implemented on the backend yet
                      <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input id="email"
                               type="email"
                               name="email"
                               className={`form-control ${errors && ('email' in errors) ? "is-invalid" : ""}`}
                               onChange={this.handleChange}
                               value={email}
                               autoComplete="email" />
                        { errors && ('email' in errors) ?
                          errors.email.map((error, idx) => (
                            <div className="invalid-feedback" key={idx}>
                              {error}
                            </div> ))
                          : ""
                        }
                      </div>
                      */}
                      <div className="form-group">
                        <label htmlFor="password1">Password:</label>
                        <input id="password1"
                               type="password"
                               name="password1"
                               className={`form-control ${errors && ('password1' in errors) ? "is-invalid" : ""}`}
                               onChange={this.handleChange}
                               value={password1}
                               autoComplete="off"
                               required />
                        { errors && ('password1' in errors) ?
                          errors.password1.map((error, idx) => (
                            <div className="invalid-feedback" key={idx}>
                              {error}
                            </div> ))
                          : ""
                        }
                      </div>
                      <div className="form-group">
                        <label htmlFor="password2">Confirm password:</label>
                        <input id="password2"
                               type="password"
                               name="password2"
                               className={`form-control ${errors && ('password2' in errors) ? "is-invalid" : ""}`}
                               onChange={this.handleChange}
                               value={password2}
                               autoComplete="off"
                               required />
                        { errors && ('password2' in errors) ?
                          errors.password2.map((error, idx) => (
                            <div className="invalid-feedback" key={idx}>
                              {error}
                            </div> ))
                          : ""
                        }
                      </div>
                      <button type="submit" className="btn btn-primary">Create an account</button>
                    </form>
                  </div>
                  <div className="card-footer text-center text-muted">
                    Already have an account? <Link to="/login">Log in</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default SignUpForm;
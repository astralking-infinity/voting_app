import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PollList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: [],
      isLoaded: false,
      placeholder: 'Loading...',
      errors: null
    }
  }

  componentDidMount() {
    const endpoint = 'http://127.0.0.1:8000/api/polls/';
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(polls => {
        this.setState({ polls, isLoaded: true });
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

  render() {
    const { polls, isLoaded, placeholder, errors  } = this.state;

    if (!isLoaded) {
      return (
        <p className="text-center">
          { errors && ('detail' in errors)
            ? errors.detail
            : <span>{placeholder} <FontAwesomeIcon icon="circle-notch" /></span>
          }
        </p>
      );
    }

    return (
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <div className="list-group">
            { polls.map((poll, index) => (
                <Link to={`/polls/${poll.id}`}
                      key={`polls-${index}`}
                      className="list-group-item list-group-item-action list-group-item-primary text-center text-truncate">
                  {poll.question}
                </Link>
              ))
            }
          </div>
          {/* Pagination area */}
        </div>
      </div>
    )
  }
}

export default PollList;
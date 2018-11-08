import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PollChart from './PollChart';

class PollDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poll: null,
      isLoaded: false,
      placeholder: 'Loading...',
      errors: null,
      voted: {
        hasVoted: false,
        choice: null
      },
      choiceSelected: null
    }

    this.handleSubmitVote = this.handleSubmitVote.bind(this);
  }

  handleSelected(choice) {
    this.setState({ choiceSelected: choice })
  }

  handleSubmitVote(event) {
    event.preventDefault();
    const { choiceSelected, poll } = this.state;
    const { isAuthenticated, user, token } = this.props;

    if (!choiceSelected) {
      alert('Please select an item you want to vote from the list.');
      return null;
    }

    if (!isAuthenticated) {
      alert('Unauthorized');
      return null;
    }

    const voteEndpoint = `http://127.0.0.1:8000/api/polls/${poll.id}/choices/${choiceSelected.id}/vote/`;
    const data = {
      voted_by: user.pk
    }
    const conf = {
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      })
    }
    fetch(voteEndpoint, conf)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(vote => {
        const { poll } = this.state;
        poll.choices.forEach((choice) => {
          if (choice.id === vote.choice) choice.votes.push(vote);
        });
        this.setState({
          poll,
          voted: {
            hasVoted: true,
            choice: choiceSelected
          }
        });
      })
      .catch(error => console.log(error.message));
  }

  componentDidMount() {
    const { pollId } = this.props.match.params;
    const endpoint = `http://127.0.0.1:8000/api/polls/${pollId}/`;
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(poll => this.setState({ poll, isLoaded: true }))
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

  componentDidUpdate(prevProps, prevState) {
    /*
    Check if a vote is already cast by the authenticated user
    */
    if (prevState.poll !== this.state.poll) {
      const { poll } = this.state;
      const { user } = this.props;
      poll.choices.forEach(choice => {
        const voted = choice.votes.find(vote => user && vote.voted_by === user.pk)
        // console.log(voted)  // Needs some handling for guest votes also
        if (voted) {
          this.setState({
            voted: {
              hasVoted: true,
              choice: choice
            }
          });
        }
      });
    }
  }

  render() {
    const { poll, isLoaded, placeholder, errors, voted } = this.state;
    const { isAuthenticated } = this.props;

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

    var pollChoices = null;
    if (voted.hasVoted) {
      pollChoices = (
        <React.Fragment>
          You voted for...
          <div className="styled-radio">
            <div className="styled-radio-success">
              <input id={`choice-id-${voted.choice.id}`}
                     type="radio"
                     name="choices"
                     checked
                     readOnly />
              <label htmlFor={`choice-id-${voted.choice.id}`}>
                {voted.choice.choice_text}
              </label>
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      pollChoices = (
        <form onSubmit={this.handleSubmitVote}>
          <div className="styled-radio">
            { poll.choices.map((choice, index) => {
              return (
                <div className="styled-radio-success" key={`choice-id-${index}`}>
                  <input id={`choice-id-${choice.id}`}
                         type="radio"
                         name="choices"
                         onChange={this.handleSelected.bind(this, choice)} />
                  <label htmlFor={`choice-id-${choice.id}`}>
                    {choice.choice_text}
                  </label>
                </div>
              )
            })}
          </div>
          <div>
            <button type="submit"
                    className="btn btn-primary btn-block">
              Vote
            </button>
          </div>
        </form>
      )
    }

    return (
      <div className="jumbotron">
        <div className="row justify-content-center">
          <div id="pollDetail" className="col-lg-4 col-md-6 col-sm-12 py-2">
            <div className="bg-light p-2 mb-5 rounded">{poll.question}</div>
            { isAuthenticated
              ? <div>{pollChoices}</div>
              : <div>
                  <p>You need to
                    &nbsp;<Link to="/login" className="">Log in</Link>&nbsp;
                    or
                    &nbsp;<Link to="/signup" className="">Sign up</Link>&nbsp;
                    to vote.
                  </p>
                </div>
            }
          </div>
          <div className="col-lg-8 col-md-6 col-sm-12 py-2">
            <PollChart poll={poll} />
          </div>
        </div>
      </div>
    );
  }
}

export default PollDetail;
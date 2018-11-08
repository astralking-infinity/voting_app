import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PollChart from './PollChart';
import NewPollForm from './NewPollForm';

class UserPolls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPolls: null,
      isLoaded: false,
      placeholder: 'Loading...',
      errors: null,
      selectedPoll: null,
      toggleModal: false
    }

    this.handleCreatePoll = this.handleCreatePoll.bind(this);
    this.handleOpenPollModal = this.handleOpenPollModal.bind(this);
    this.handleClosePollModal = this.handleClosePollModal.bind(this);
  }

  handleOpenPollModal() {
    this.setState({ toggleModal: true });
  }

  handleClosePollModal() {
    this.setState({ toggleModal: false });
  }

  handleShowDetail(poll, event) {
    event.preventDefault();
    this.setState({ selectedPoll: poll });
  }

  handleCreatePoll(question, choices) {
    const pollEndpoint = 'http://127.0.0.1:8000/api/polls/';
    const { user, token } = this.props;

    // Don't proceed when poll's choices is less than 2
    if (choices.length - 1 < 2) {
      console.log('Choices length is less than 2.');
      return null;
    }

    const pollData = { question, created_by: user.pk };
    const pollConf = {
      method: 'post',
      body: JSON.stringify(pollData),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      })
    };

    fetch(pollEndpoint, pollConf)
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(poll => {
        this.postPollChoices(token, poll, choices)
        this.handleClosePollModal();
      })
      .catch(errorData => {
        errorData.then(errors => this.setState({ errors }));
      });
  }

  postPollChoices(token, poll, choices) {
    const { userPolls } = this.state;
    const choiceEndpoint = `http://127.0.0.1:8000/api/polls/${poll.id}/choices/`
    choices.forEach((choiceItem) => {
      if (choiceItem.choice_text) {
        const choice = {
          poll: poll.id,
          choice_text: choiceItem.choice_text
        };
        const choiceConf = {
          method: 'post',
          body: JSON.stringify(choice),
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          })
        };
        fetch(choiceEndpoint, choiceConf)
          .then(response => {
            if (!response.ok) {
              throw response.json();
            }
            return response.json();
          })
          .then(choiceData => {
            var found = false;
            userPolls.forEach((pollItem) => {
              if (pollItem.id === poll.id) {
                pollItem.choices.push(choiceData);
                found = true;
              }
            });
            if (!found) {
              userPolls.reverse();  // Need to change this so new poll will be added at the beginning of the list.
              userPolls.push(poll);
              userPolls.reverse();
            }
            this.setState({ userPolls });
          })
          .catch(errorData => {
            if (errorData instanceof Promise) {
              errorData.then(errors => this.setState({ errors }));
            } else {
              this.setState({ placeholder: errorData.message });
            }
          });
      }
    });
  }

  handleDeletePoll(poll) {
    var ret = window.confirm('Are you sure you want to deleted this?');
    if (!ret) return null;
    const pollEndpoint = `http://127.0.0.1:8000/api/polls/${poll.id}/`
    const { token } = this.props;
    const deleteConf = {
      method: 'delete',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      })
    }
    fetch(pollEndpoint, deleteConf)
      .then(() => {
        const { userPolls } = this.state;
        const newUserPolls = userPolls.filter((userPoll) => userPoll.id !== poll.id);
        this.setState({
          userPolls: newUserPolls,
          selectedPoll: null
        });
      });
  }

  componentDidMount() {
    const { token, match } = this.props;
    const { username } = match.params;
    const endpoint = `http://127.0.0.1:8000/api/${username}/polls/`
    const conf = {
      method: 'get',
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
      .then(userPolls => this.setState({ userPolls, isLoaded: true }))
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
    const { userPolls,
            isLoaded,
            placeholder,
            errors,
            selectedPoll,
            toggleModal } = this.state;
    const { user, token } = this.props;
    const { username } = this.props.match.params;

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
      <React.Fragment>
        {/* Modal */}
        { toggleModal
          ? <NewPollForm user={user}
                         token={token}
                         closeCallback={this.handleClosePollModal}
                         createPollCallback={this.handleCreatePoll} />
          : ""
        }

        <div className="container">
          <h1 className="text-center">{username}</h1>
        </div>
        <div className="row">
          <aside className="col-md-4">
            <div className="container border">
              <div className="border-bottom my-2 pb-2">
                {/* Modal trigger */}
                <button className="btn btn-success btn-sm float-right"
                        onClick={this.handleOpenPollModal}>New</button>
                <h6>Polls</h6>
              </div>
              <div className="sidenav-item my-2">
                <div className="nav nav-pills flex-column" role="tablist" aria-orientation="vertical">
                  { userPolls.map((poll, index) => (
                    <Link className={`nav-link text-truncate ${selectedPoll && selectedPoll.id === poll.id ? 'active' : ''}`}
                          to="#"
                          key={`user-polls-${index}`}
                          onClick={this.handleShowDetail.bind(this, poll)}>{poll.question}</Link> ))
                  }
                </div>
              </div>
            </div>
          </aside>
          <section className="col-md-8">
            { selectedPoll
              ? <div>
                  <div className="border-bottom my-4 pb-2">
                    <button className="btn btn-danger btn-sm float-right"
                            onClick={this.handleDeletePoll.bind(this, selectedPoll)}>
                      Delete</button>
                    <h5 className="">{selectedPoll.question}</h5>
                  </div>
                  <PollChart poll={selectedPoll} redraw />
                </div>
              : <p className="text-center pt-2">Select a poll to view result</p>
            }
          </section>
        </div>
      </React.Fragment>
    );
  }
}

export default UserPolls;


/*

TODO:
1. Storage for authentication data. (DONE: used localStorage as persistent storage)
2. Design for profile's my polls navigation. (Slightly DONE: Still need to modify the
nav to minimize it's height when in mobile view port)
3. Voting implemented only for authenticated user. (DONE: Atleast temporarily until I figure out how to track guest users' votes)
4. Include pagination.

*/
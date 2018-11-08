import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NewPollForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      choices: [{ choice_text: '' }]
    }

    this.handleCreatePoll = this.handleCreatePoll.bind(this);
    this.handleQuestionInput = this.handleQuestionInput.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleQuestionInput(event) {
    const value = event.target.value;
    this.setState({ question: value });
  }

  handleChoiceInput(idx, event) {
    const { choices } = this.state;
    var addNew = false;
    const newChoices = choices.map((choice, cidx) => {
      if (idx !== cidx) {
        return choice;
      }
      if (cidx === choices.length - 1) addNew = true;
      return { ...choice, choice_text: event.target.value };
    })

    if (addNew) {
      newChoices.push({choice_text: ''});
    }
    this.setState({ choices: newChoices });
  }

  handleRemoveChoice(idx) {
    this.setState(prevState => ({
      choices: prevState.choices.filter((c, cidx) => idx !== cidx)
    }));
  }

  handleCreatePoll(event) {
    event.preventDefault();
    const { question, choices } = this.state;
    const { createPollCallback } = this.props;
    createPollCallback(question, choices);
  }

  handleCloseModal() {
    const { closeCallback } = this.props;
    closeCallback();
  }

  render() {
    const { question, choices } = this.state;

    return (
      <React.Fragment>
        <div className="modal fade show" id="createPollModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={this.handleCreatePoll}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">Create poll</h5>
                  <button type="button"
                          className="close"
                          aria-label="Close"
                          onClick={this.handleCloseModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <input type="text"
                           className="form-control"
                           onChange={this.handleQuestionInput}
                           value={question}
                           placeholder="Enter question"
                           autoComplete="off"
                           required />
                  </div>
                  <label className="form-label">Choices</label>
                  { choices.map((choice, idx) => (
                    <div className="form-group row" key={`choice-id-${idx}`}>
                      <div className="col-10">
                        <input type="text"
                               className="form-control"
                               onChange={this.handleChoiceInput.bind(this, idx)}
                               value={choice.choice_text}
                               placeholder="Enter choice"
                               autoComplete="off" />
                      </div>
                      <div className="">
                        { choices.length - 2 >= idx ?
                          <button type="button"
                                  className="btn btn-secondary"
                                  onClick={this.handleRemoveChoice.bind(this, idx)}>
                            <FontAwesomeIcon icon="minus" />
                          </button> : ""
                        }
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button"
                          className="btn btn-secondary"
                          onClick={this.handleCloseModal}>Cancel</button>
                  <button type="submit"
                          className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewPollForm;
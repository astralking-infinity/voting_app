import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs';

class PollChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legend: null
    }
  }

  setNewLegend() {
    const legend = this.refs.chart.getChart().generateLegend();
    this.setState({ legend });
  }

  componentDidMount() {
    this.setNewLegend();
  }

  componentDidUpdate(prevProps) {
    if (this.props.poll.id !== prevProps.poll.id) {
      this.setNewLegend();
    }
  }

  render() {
    const { legend } = this.state;
    const { poll, redraw } = this.props;

    var data = [];
    var emptyVotes = true;
    poll.choices.forEach(choice => {
      data.push({
        value: choice.votes.length,
        label: choice.choice_text
      });
      if (choice.votes.length > 0)
        emptyVotes = false;
    });

    const options = {
      animateScale: true,
      animationSteps: 30,
      animationEasing: 'linear',
      responsive: true,
      maintainAspectRatio: false
    }

    return (
      <React.Fragment>
        <div id="pollChart" className="chart-container">
          { emptyVotes
            ? <span className="position-absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)"
                    }}>
                Empty votes</span>
            : ""
          }
          <Doughnut data={data}
                    options={options}
                    ref="chart"
                    redraw={redraw}
                    className={emptyVotes ? "invisible" : "visible"} />
        </div>
        <div id="legend"
             className="legend-container"
             dangerouslySetInnerHTML={{__html: legend }} >
        </div>
      </React.Fragment>
    );
  }
}

export default PollChart;
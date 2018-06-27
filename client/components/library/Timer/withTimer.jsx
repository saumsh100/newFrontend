
import React, { Component, PropTypes } from 'react';

export default function withTimer(BasicComponent) {
  class TimerComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        _secondsLeft: props.secondsLeft || props.totalSeconds,
      };

      this.tick = this.tick.bind(this);
    }

    componentDidMount() {
      // componentDidMount is called by react when the component
      // has been rendered on the page. We can set the interval here:
      const { onStart, interval } = this.props;
      this.timer = setInterval(this.tick, interval);
      onStart && onStart();
    }

    componentWillUnmount() {
      // This method is called immediately before the component is removed
      // from the page and destroyed. We can clear the interval here:
      clearInterval(this.timer);
    }

    tick() {
      // This function is called every props.interval ms. It updates the
      // secondsLeft counter. Calling setState causes the component to be re-rendered
      const { _secondsLeft } = this.state;
      const { onEnd } = this.props;
      const newSecondsLeft = _secondsLeft - 1;
      this.setState({ _secondsLeft: newSecondsLeft });

      // Clear it if the total time has elapsed
      if (newSecondsLeft <= 0) {
        clearInterval(this.timer);
        onEnd && onEnd();
      }
    }

    render() {
      const { totalSeconds } = this.props;

      const { _secondsLeft } = this.state;

      return (
        <BasicComponent
          {...this.props}
          totalSeconds={totalSeconds}
          secondsLeft={_secondsLeft}
        />
      );
    }
  }

  TimerComponent.defaultProps = {
    interval: 1000,
  };

  TimerComponent.propTypes = {
    totalSeconds: PropTypes.number.isRequired,
    interval: PropTypes.number,
    secondsLeft: PropTypes.number,
    onStart: PropTypes.func,
    onEnd: PropTypes.func,
  };

  return TimerComponent;
}

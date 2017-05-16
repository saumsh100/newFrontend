
import { Component, PropTypes } from 'react';

export default class Bundle extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      mod: null,
    };

    this.mounted = false;
  }

  componentWillMount() {
    this.mounted = true;
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  load(props) {
    this.setState({
      mod: null,
    });

    props.load((mod) => {
      if (!this.mounted) {
        return;
      }

      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod,
      });
    });
  }

  render() {
    return this.props.children(this.state.mod);
  }
}

Bundle.propTypes = {
  load: PropTypes.func.isRequired,
  name: PropTypes.string,
  children: PropTypes.func.isRequired,
};

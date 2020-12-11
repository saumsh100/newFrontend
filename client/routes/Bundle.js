
import PropTypes from 'prop-types';
import { Component } from 'react';

export default class Bundle extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      mod: null,
    };

    this.mounted = false;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.mounted = true;
    this.load(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.load !== this.props.load) {
      this.load(this.props);
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
  children: PropTypes.func.isRequired,
};

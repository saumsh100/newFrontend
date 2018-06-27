
import React from 'react';
import omit from 'lodash/omit';
import { StyleExtender } from '../components/Utils/Themer';

export default function withTheme(BasicComponent, baseStyle) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        componentStyle: baseStyle,
      };
    }

    componentDidMount() {
      if (this.props.theme) {
        this.setState({
          componentStyle: StyleExtender(this.props.theme, baseStyle),
        });
      }
    }

    render() {
      const newProps = omit(this.props, ['theme']);

      return <BasicComponent theme={this.state.componentStyle} {...newProps} />;
    }
  };
}

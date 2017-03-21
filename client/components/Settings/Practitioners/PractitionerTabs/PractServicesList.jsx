import React, {Component, PropTypes} from 'react';
import { Form, Row, Col, Field, Toggle } from '../../../library';



class PractServicesList extends Component {
  constructor(props){
    super(props)

    this.state = {
      defaultChecked: false,
      value: '',
    }
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillMount() {
    const { service, setAllServices, serviceIds } = this.props;

    let defaultChecked = !!((serviceIds.indexOf(service.get('id')) > -1 ) || setAllServices)

    let value = defaultChecked ? 'add' : 'remove';

    this.setState({ defaultChecked, value });
  }

  handleToggle(e) {
    e.stopPropagation();
    let value = this.state.value === 'add' ? 'remove' : 'add';
    this.props.updateServiceIds(this.props.service.get('id'), value);
    this.setState({ value });
  }

  render() {
    const { service } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        {service.get('name')}
        <Toggle
          defaultChecked={this.state.defaultChecked}
          value={this.state.value}
          onChange={this.handleToggle}
        />
      </div>
    );
  }

}

export default PractServicesList;
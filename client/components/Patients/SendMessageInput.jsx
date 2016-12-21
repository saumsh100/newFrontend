
import React, { PropTypes, Component } from 'react';
import {
  Input,
  InputGroup,
  InputGroupButton,
} from 'reactstrap';
import { Button } from '../library';

class SendMessageInput extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      message: '',
    };
  }
  
  render() {
    return (
      <form onSubmit={e => this.props.onSend(e, this.state.message)}>
        <InputGroup style={{ position: 'absolute', bottom: 0 }}>
          <Input type="text" onChange={e => this.setState({ message: e.target.value })} />
          <InputGroupButton>
            <Button color="primary" type="submit">
              Send
            </Button>
          </InputGroupButton>
        </InputGroup>
      </form>
    );
  }
}

SendMessageInput.propTypes = {
  patient: PropTypes.object,
  onSend: PropTypes.func.isRequired,
};

export default SendMessageInput;

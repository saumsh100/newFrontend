
import React, { Component } from 'react';

class Embed extends Component {
  constructor(props) {
    super(props);
  
    this.state = { availabilities: [] };
    this.bookAvailability = this.bookAvailability.bind(this);
  }
  
  componentDidMount() {
    window.socket.emit('fetchAvailabilities');
    window.socket.on('receiveAvailabilities', (results) => {
      this.setState({ availabilities: results });
    });
  
    window.socket.on('availabilityAdded', (result) => {
      console.log('availabilityAdded', result);
      const availabilities = this.state.availabilities.concat(result);
      this.setState({ availabilities });
    });
  
    window.socket.on('availabilityRemoved', (result) => {
      const availabilities = this.state.availabilities.filter(avail => avail.id !== result.id);
      this.setState({ availabilities });
    });
  }
  
  bookAvailability(id) {
    if (confirm('Are you sure you want to book this availability?')) {
      window.socket.emit('removeAvailability', { id });
    }
  }
  
  render() {
    const { availabilities } = this.state;
    return (
      <div>
        <ul className="list-group">
          {availabilities.map((availability) => {
            const {
              id,
              title,
              start,
              end,
            } = availability;
            
            return (
              <li
                key={id}
                className={'list-group-item list-group-item-action'}
                onClick={() => this.bookAvailability(id)}
              >
                <strong><span>{title}  </span></strong>
                <small><span>{(new Date(start)).toLocaleString()}  ->  </span></small>
                <small><span>{(new Date(end)).toLocaleString()}</span></small>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

Embed.propTypes = {};

export default Embed;


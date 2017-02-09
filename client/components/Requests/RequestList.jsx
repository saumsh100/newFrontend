
import React, { Component, PropTypes } from 'react';
import RequestListItem from './RequestListItem';


class RequestList extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const requests = this.props.requests.get('models').toArray();

    requests.sort((a,b) =>{
        return Date.parse(a.startTime) - Date.parse(b.startTime);
    });

    return (
      <div>
        <h1> There are {requests.length} requests</h1>
        {requests.map((request) =>{
          return (
                <RequestListItem
                  key={request.id}
                  request={request}
                />
            );
          })
        }
      </div>
    );
  }
}

RequestList.propTypes = {};

export default RequestList;


import React, { Component } from 'react';
import { InfiniteScroll } from '../../library';

function createNumbersArray(start, length) {
  const arr = new Array(length);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = start + i;
  }

  return arr;
}

function fetchNumbers(start, length) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newNumbers = createNumbersArray(start, length);
        resolve(newNumbers);
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

const LIMIT = 10;

export default class TestInfiniteScroll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],

      // Was too lazy and this fixed initial load at 0, 10
      start: -10,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    // this.loadMore();
  }

  loadMore() {
    console.log('FETCHING MORE');
    const oldItems = this.state.items;
    const start = this.state.start + LIMIT;
    fetchNumbers(start, LIMIT)
      .then(newItems =>
        this.setState({ items: [...oldItems, ...newItems], start }))
      .catch(err => console.log(err));
  }

  render() {
    const { items } = this.state;
    const itemComponents = items.map(item => (
      <div
        style={{
            height: '50px',
            padding: '5px',
            border: '1px solid grey',
            backgroundColor: 'white',
          }}
        key={item}
      >
        {item}
      </div>
    ));

    const hasMore = items.length < 100;
    return (
      <div>
        <h1>InfiniteScroll</h1>
        <div style={{ height: '400px', overflow: 'auto', border: '2px solid' }}>
          <InfiniteScroll
            loadMore={this.loadMore}
            loader={<div style={{ clear: 'both' }}>Loading...</div>}
            hasMore={hasMore}
            useWindow={false}
            threshold={50}
          >
            {itemComponents}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";

import "./App.css";

class App extends Component {
  state = { n: 0, data: [] };

  updateN = event => {
    this.setState({ n: event.target.value });
  };

  fetchData = event => {
    event.preventDefault();
    const n = this.state.n;
    if (n !== 0)
      fetch(`${n}.json`).then(res => {
        res.json().then(data => this.setState({ data }));
      });
    else this.setState({ data: [] });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.fetchData}>
            <label>
              Number:
              <input
                type="number"
                value={this.state.n}
                onChange={this.updateN}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <h1 className="App-title">Frequency of Words</h1>

          {this.state.data.length ? (
            <table className="App-table">
              <tr>
                <th>Word</th>
                <th>Frequency</th>
              </tr>
              {this.state.data.map(set => (
                <tr>
                  <td>{set[0]}</td>
                  <td>{set[1]}</td>
                </tr>
              ))}
            </table>
          ) : null}
        </header>
      </div>
    );
  }
}

export default App;

import React from "react";

import List from "../List/index.jsx";

import style from "./App.module.css";

const data = [
  {
    id: "1234",
    name: "Apple"
  },
  {
    id: "4321",
    name: "Google"
  },
  {
    id: "3241",
    name: "Microsoft"
  },
  {
    id: "9876",
    name: "Uber"
  },
  {
    id: "7586",
    name: "Twilio"
  }
];

const combine = (origin, destiny) => ({
  id: destiny.id,
  name: `${destiny.name}, ${origin.name}`
});

class App extends React.Component {
  state = {
    items: data
  };

  handleCombine = (originIndex, destinyIndex) => {
    const { items } = this.state;
    const newItems = Array.from(items);
    const origin = newItems[originIndex];
    const destiny = newItems[destinyIndex];
    const combinedItem = combine(origin, destiny);
    newItems[destinyIndex] = combinedItem;
    newItems.splice(originIndex, 1);

    this.setState({
      items: newItems
    });
  };

  render() {
    const { items } = this.state;

    return (
      <div className={style.root}>
        <List key={items.length} items={items} onCombine={this.handleCombine} />
      </div>
    );
  }
}

export default App;

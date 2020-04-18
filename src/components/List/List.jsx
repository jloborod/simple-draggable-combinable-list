import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Draggable from "react-draggable";

import DefaultItem from "./Item/index.jsx";

import style from "./List.module.css";

const getIdAndIndex = node => ({
  id: node.getAttribute?.("data-id"),
  index: node.getAttribute?.("data-index")
});

class List extends React.Component {
  initialState = {
    dragId: null,
    dragIndex: null,
    dragOverId: null,
    dragOverIndex: null
  };

  state = this.initialState;

  handleDragStart = (e, data) => {
    const { node } = data;
    const { id, index } = getIdAndIndex(node);

    this.setState({
      dragId: id,
      dragIndex: index,
      ...data
    });
  };

  handleDrag = e => {
    const { dragOverId } = this.state;
    const { target } = e;

    // Important
    e.preventDefault();

    if (target) {
      const { id, index } = getIdAndIndex(target.parentNode);

      if (id !== dragOverId) {
        this.setState({
          dragOverId: id,
          dragOverIndex: index
        });
      }
    }
  };

  handleDragEnd = () => {
    const { onCombine } = this.props;
    const { dragId, dragIndex, dragOverId, dragOverIndex } = this.state;

    if (dragId && dragOverId && dragId !== dragOverId) {
      /*  
          As Draggable tries to setState when the 
          component is unmounted, it is needed to
          push onCombine to the event loop queue.
          onCombine would be run after setState on
          Draggable so it would fix the issue until
          they fix it on their end.
      */
      setTimeout(() => {
        onCombine(dragIndex, dragOverIndex);
      }, 0);
    }

    this.setState(this.initialState);
  };

  render() {
    const { className, items, itemComponent: Item } = this.props;
    const { dragId, dragOverId, x, y } = this.state;
    const isDisabled = items.length <= 1;

    return (
      <ul className={classnames(style.root, className)}>
        {items.map((item, index) => (
          <Draggable
            key={item.id}
            defaultClassName={classnames(
              style.item,
              isDisabled && style.itemDisabled
            )}
            defaultClassNameDragging={style.itemDragging}
            defaultClassNameDragged={style.itemDragged}
            disabled={isDisabled}
            axis="y"
            bounds="parent"
            position={!dragId ? { x: x ?? 0, y: y ?? 0 } : undefined}
            handle={`.${style.item}`}
            onStart={this.handleDragStart}
            onDrag={this.handleDrag}
            onStop={this.handleDragEnd}
          >
            <li data-id={item.id} data-index={index}>
              <Item
                className={classnames(
                  style.itemContent,
                  dragId !== dragOverId &&
                    dragOverId === item.id &&
                    style.draggedOver
                )}
                onDragOver={this.handleDrag}
                {...item}
              />
            </li>
          </Draggable>
        ))}
      </ul>
    );
  }
}

List.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  itemComponent: PropTypes.elementType
};

List.defaultProps = {
  className: undefined,
  itemComponent: DefaultItem
};

export default List;

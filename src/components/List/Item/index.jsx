import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import style from "./Item.module.css";

const Item = ({ className, name }) => (
  <div className={classnames(style.root, className)}>{name}</div>
);

Item.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired
};

Item.defaultProps = {
  className: style.handle
};

export default Item;

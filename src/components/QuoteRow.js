import React from "react";
import { numWithCommas } from "../utils";
import "./QouteRow.sass";

export function QouteRow(props) {
  const { side, count, amount, price } = props;

  return (
    <div key={price} className={`row row-${side}`}>
      <div>{count}</div>
      <div>{amount}</div>
      <div>{numWithCommas(price)}</div>
    </div>
  );
}

export default React.memo(QouteRow);

import MemoizedQouteRow from "./QuoteRow";
import "./Widget.sass";

function Widget(props) {
  const { bookData } = props;

  const renderHeader = () => {
    return (
      <div className="header">
        <div>COUNT</div>
        <div>AMOUNT</div>
        <div>PRICE</div>
      </div>
    );
  };

  return (
    <div className="widget">
      <div className="bids">
        {renderHeader()}
        {bookData.bids &&
          bookData.bids.map((row) => (
            <MemoizedQouteRow
              side="bids"
              key={row.price}
              count={row.count}
              amount={row.amount}
              price={row.price}
            />
          ))}
      </div>
      <div className="asks">
        {renderHeader()}
        {bookData.asks &&
          bookData.asks.map((row) => (
            <MemoizedQouteRow
              side="asks"
              key={row.price}
              count={row.count}
              amount={row.amount}
              price={row.price}
            />
          ))}
      </div>
    </div>
  );
}

export default Widget;

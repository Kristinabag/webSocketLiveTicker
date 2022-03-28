export function initBook() {
  return (
    JSON.parse(localStorage.getItem("BOOK")) || {
      bids: [],
      asks: [],
    }
  );
}

export function numWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

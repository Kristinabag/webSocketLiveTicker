import { eventChannel, END } from "redux-saga";
import { call, put, take, fork, cancelled } from "redux-saga/effects";
import { initBook } from "../../utils";
import { loadBookData } from "../actions/loadBookData";

let BOOK = initBook();

function processDataIntoBook(quotes) {
  if (!localStorage.getItem("BOOK") && quotes?.length === 50) {
    // set initial book data
    const bids = [],
      asks = [];
    for (let i = 0; i < 25; i++) {
      bids.push({
        count: quotes[i][1],
        amount: quotes[i][2].toFixed(4),
        price: quotes[i][0],
      });
      asks.push({
        count: quotes[i + 25][1],
        amount: quotes[i + 25][2].toFixed(4),
        price: quotes[i + 25][0],
      });
    }
    BOOK.bids = bids.sort((a, b) => b.price - a.price);
    BOOK.asks = asks.sort((a, b) => a.price - b.price);
  } else {
    // refresh data
    const isBids = quotes[2] > 0;
    const isAsks = quotes[2] < 0;
    BOOK = JSON.parse(JSON.stringify(BOOK));
    let changedSide = (isBids && "bids") || (isAsks && "asks");
    if (!BOOK[changedSide]) return;
    if (quotes[1] === 0) {
      BOOK[changedSide] = BOOK[changedSide].filter(
        (row) => row.price !== quotes[0]
      );
    } else {
      let changedRow = BOOK[changedSide].find((row) => row.price === quotes[0]);
      if (changedRow) {
        changedRow.count = quotes[1];
        changedRow.amount = Math.abs(quotes[2]).toFixed(4);
      } else {
        BOOK[changedSide].push({
          count: quotes[1],
          amount: Math.abs(quotes[2]).toFixed(4),
          price: quotes[0],
        });
        BOOK[changedSide].sort((a, b) =>
          isBids ? b.price - a.price : a.price - b.price
        );
      }
    }
  }
}

function createWebSocketConnection() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    socket.onopen = function () {
      console.info("Subscribing: tBTCUSD");
      socket.send(
        JSON.stringify({
          event: "subscribe",
          channel: "book",
          symbol: "tBTCUSD",
        })
      );
      resolve(socket);
    };

    socket.onerror = function (evt) {
      reject(evt);
    };
  });
}

function createSocketChannel(socket) {
  return eventChannel((emit) => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event) return;
      processDataIntoBook(data[1]);
      // even if we refresh the page, the trades of old data is retained
      localStorage.setItem("BOOK", JSON.stringify(BOOK));
      emit(BOOK);
    };

    socket.onclose = () => {
      emit(END);
    };

    const unsubscribe = () => {
      socket.onmessage = null;
    };

    return unsubscribe;
  });
}

function* listenForSocketMessages() {
  let socket;
  let socketChannel;

  try {
    socket = yield call(createWebSocketConnection);
    socketChannel = yield call(createSocketChannel, socket);

    while (true) {
      // wait for a message
      const payload = yield take(socketChannel);
      // a message has been received, dispatch an action with the message payload
      yield put(loadBookData(payload));
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (yield cancelled()) {
      // close the channel
      socketChannel.close();
      // close the WebSocket connection
      socket.close();
    }
  }
}

export default function* connect() {
  yield fork(listenForSocketMessages);
}

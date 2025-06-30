import React from 'react';
import { BookFrame, ColumnType, DataSource } from './components'
import { useSocketNotification } from "@themeetgroup/web-notification-sdk";
import styles from './App.module.css'

const BOOK_LIMIT = 1000;
// const BOOK_SIDE_LIMIT = 100;

const getValidData = (dataList) =>
  dataList.filter((pairValue) => parseFloat(pairValue[1]) !== 0)


function App() {
  const { addSocketConnection } = useSocketNotification();
  const [operationsData, setOperationsData] = React.useState({
    asks: [],
    bids: []
  });



  const handleSocketMessage = React.useCallback((data) => {
    // console.table({
    //   _place: "[BookFrame] message from socket SDK",
    //   data,
    // });
    setOperationsData((current) => {
      const validId = !current?.lastUpdateId || data.U === current.lastUpdateId + 1;

      if (!validId) {
        return current;
      }

      const validData = {
        asks: getValidData(data.a) ?? [],
        bids: getValidData(data.b) ?? [],
      }

      // console.table({ data, validData })

      return {
        ...current,
        asks: [...current.asks, ...validData.asks].slice(
          BOOK_LIMIT * -1
        ),
        bids: [...current.bids, ...validData.bids].slice(
          BOOK_LIMIT * -1
        ),
        lastUpdateId: data.u,
      };
    })
  }, []);

  React.useEffect(() => {
    addSocketConnection("wss://stream.binance.com:9443/ws/usdtbrl@depth", {
      onMessage: handleSocketMessage,
      showStateUpdateInfo: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSocketMessage])

  React.useEffect(() => {
    const iframesList = document.querySelectorAll("iframe")

    // console.log("all iframes", { iframesList, operationsData });

    for (const frame of iframesList) {
      frame?.contentWindow.postMessage({
        type: "opData",
        operationsData,
      }, "*")
    }
  }, [operationsData])

  return (
    <main className={styles.mainContainer}>
      <BookFrame
        iframeId="frame-1"
        typeColumnShow={ColumnType.SELL}
        showHeader={false}
        showCurrentTrade={false}
        operationDataSource={DataSource.Frame}
      />

      <BookFrame
        iframeId="frame-2"
        typeColumnShow={ColumnType.BOTH}
        showHeader={true}
        showCurrentTrade={true}
        operationDataSource={DataSource.Frame}
      />

      <BookFrame
        iframeId="frame-3"
        typeColumnShow={ColumnType.BUY}
        showHeader={false}
        showCurrentTrade={false}
        operationDataSource={DataSource.Frame}
      />
    </main>
  )
}

export default App

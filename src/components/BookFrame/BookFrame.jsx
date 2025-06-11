import React from "react";
import styles from "./BookFrame.module.css";

/**
 * Ideally this would be on a different file, but for test it's being made here
 */
export const ColumnType = {
  BOTH: "both",
  BUY: "buy",
  SELL: "sell",
  NONE: "none",
};

export const DataSource = {
  Frame: "frame",
  Socket: "socket",
}

/**
 * BookFrame component
 * 
 * @param {object} props
 * @param {string} [props.iframeId="frame-1"] - The ID of the iframe element.
 * @param {string} [props.typeColumnShow="both"] - Determines which type of column to show.
 * @param {boolean} [props.showHeader=true] - Whether to show the header.
 * @param {boolean} [props.showCurrentTrade=true] - Whether to show the current trade.
 */
export const BookFrame = (props) => {
  const {
    iframeUrl = "http://localhost:5173",
    iframeId = "frame-1",
    typeColumnShow = "both",
    showHeader = true,
    showCurrentTrade = true,
    operationDataSource = DataSource.Frame,
  } = props;
  const [iframeElement, setIframeElement] = React.useState();
  const handleMessage = React.useCallback((event) => {

    // console.table({
    //   _event: `[Message on ${iframeId}] received`,
    //   data: event,
    // });

    if (operationDataSource === DataSource.Frame && event?.data?.type === "opData") {
      iframeElement?.contentWindow.postMessage(event.data, "*")
    }
  }, [iframeElement, operationDataSource]);

  React.useEffect(() => {
    window.addEventListener("message", handleMessage);

    /**
     * Not the ideal, but doing this for testing purposes
     * For now it's being done like this to ensure the iframe is loaded and making it "sync"
     */
    setTimeout(() => {
      // const iframeElement = document.getElementById(iframeId);
      if (iframeElement) {
        console.log("LOGGING");
        iframeElement.contentWindow.postMessage({
          type: "config",
          typeColumnShow,
          showHeader,
          showCurrentTrade,
          operationDataSource,
        }, "*")
      }
    }, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
    }
  }, [handleMessage, iframeElement, iframeId, operationDataSource, props, showCurrentTrade, showHeader, typeColumnShow])

  React.useEffect(() => {
    if (!iframeElement) {
      const element = document.getElementById(iframeId);;

      setIframeElement(element);
    }
  }, [iframeElement, iframeId]);

  return (
    <iframe
      id={iframeId}
      src={iframeUrl}
      className={styles["bookFrame"]}
    />
  )
}
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useCallback, forwardRef } from "react";
import styles from "./BookFrame.module.css";
import { DataSource } from "./BookFrame.constants";

/**
 * BookFrame component
 * This component can act as a standard display iframe or as a WebSocket data module.
 *
 * @param {object} props
 * @param {string} [props.iframeUrl="https://test--investest.netlify.app/"] - The URL for the iframe source.
 * @param {string} [props.iframeId="frame-1"] - The ID of the iframe element.
 * @param {string} [props.typeColumnShow="both"] - Determines which type of column to show.
 * @param {boolean} [props.showHeader=true] - Whether to show the header.
 * @param {boolean} [props.showCurrentTrade=true] - Whether to show the current trade.
 * @param {string} [props.operationDataSource="frame"] - The data source for the iframe's internal logic.
 * @param {boolean} [props.isSocketModule=false] - If true, this instance will act as the WebSocket module.
 */
export const BookFrame = forwardRef((props, ref) => {
  const {
    iframeUrl = "https://test--investest.netlify.app/",
    iframeId = "frame-1",
    typeColumnShow = "both",
    showHeader = true,
    showCurrentTrade = true,
    operationDataSource = DataSource.Frame,
    isSocketModule = false,
  } = props;

  // Use the ref passed from the parent, or create a local one.
  // This allows the parent component to interact with the iframe DOM element.
  const internalRef = useRef(null);
  const iframeRef = ref || internalRef;

  // Effect to initialize the WebSocket connection for the "Module" instance.
  // This runs only when `isSocketModule` is true.
  useEffect(() => {
    // If this instance is not the designated module, do nothing.
    if (!isSocketModule) return;

    console.log(`[Module ${iframeId}] Initializing WebSocket...`);
    // NOTE: This is a public test WebSocket. Replace with your actual endpoint.
    const ws = new WebSocket("wss://socketsbay.com/wss/v2/1/demo/");

    ws.onopen = () => {
      console.log(`[Module ${iframeId}] WebSocket Connected.`);
    };

    ws.onmessage = (event) => {
      // We assume the WebSocket sends stringified JSON.
      const messageData = JSON.parse(event.data);
      
      // Create a message object that child iframes will understand.
      const opData = { type: "opData", payload: messageData };
      
      console.log(`[Module ${iframeId}] Received via WebSocket, posting to parent:`, opData);
      
      // Send the data to the parent window. The parent will then broadcast it.
      window.parent.postMessage(opData, "*");
    };

    ws.onerror = (error) => {
      console.error(`[Module ${iframeId}] WebSocket Error:`, error);
    };

    ws.onclose = () => {
        console.log(`[Module ${iframeId}] WebSocket Disconnected.`);
    };

    // Cleanup function: close the WebSocket connection when the component unmounts.
    return () => {
      console.log(`[Module ${iframeId}] Closing WebSocket.`);
      ws.close();
    };
  }, [isSocketModule, iframeId]); // Dependencies for the effect

  /**
   * This function is triggered once the iframe has completely loaded.
   * It sends the initial configuration message to the iframe's content.
   * This is more reliable than using a `setTimeout`.
   */
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      console.log(`[Frame ${iframeId}] Loaded. Posting initial config.`);
      iframe.contentWindow.postMessage({
        type: "config",
        typeColumnShow,
        showHeader,
        showCurrentTrade,
        operationDataSource,
      }, "*");
    }
  }, [iframeRef, iframeId, operationDataSource, showCurrentTrade, showHeader, typeColumnShow]);

  return (
    <iframe
      ref={iframeRef}
      id={iframeId}
      src={iframeUrl}
      className={styles["bookFrame"]}
      onLoad={handleIframeLoad}
    />
  );
});

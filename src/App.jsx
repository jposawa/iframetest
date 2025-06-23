import { useEffect, useRef } from 'react';
import styles from './App.module.css'
import { BookFrame, ColumnType, DataSource } from './components'

function App() {
  const frame1Ref = useRef(null);
  const frame3Ref = useRef(null);

  useEffect(() => {
    const handleBroadcast = (event) => {
      if (event.data?.type === 'opData') {
        console.log("[App Pai] Recebeu opData do módulo. Distribuindo para os filhos...");

        const recipientFrames = [frame1Ref, frame3Ref];

        recipientFrames.forEach(ref => {
          if (ref.current) {
            ref.current.contentWindow.postMessage(event.data, '*');
          }
        });
      }
    };

    window.addEventListener('message', handleBroadcast);

    return () => {
      window.removeEventListener('message', handleBroadcast);
    };
  }, []);

  return (
    <main className={styles.mainContainer}>
      <BookFrame
        ref={frame1Ref}
        iframeId="frame-1"
        typeColumnShow={ColumnType.SELL}
        showHeader={false}
        showCurrentTrade={false}
        operationDataSource={DataSource.Frame}
      />

      <BookFrame
        iframeId="frame-2"
        isSocketModule={true}
        typeColumnShow={ColumnType.BOTH}
        showHeader={true}
        showCurrentTrade={true}
        operationDataSource={DataSource.Socket}
      />

      <BookFrame
        ref={frame3Ref}
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

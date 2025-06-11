import styles from './App.module.css'
import { BookFrame, ColumnType, DataSource } from './components'

function App() {
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
        operationDataSource={DataSource.Socket}
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

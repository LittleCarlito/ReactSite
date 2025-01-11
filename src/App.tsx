import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// TODO Prebuilt .css file causes cursor tracking to be offset
//        Going to need own css structure
import './App.css'
import TestButton from './buttons/test_button'
import MovingDot from './pointer/moving_dot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div style={{ position: 'relative'}}>
        <div style={{ zIndex: 1}}>
          <MovingDot />
        </div>
        <div style={{ zIndex: 0, marginTop: '-100vh'}}>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>I'm drunk as a skunk</h1>
          <div className="card">
            <TestButton />
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

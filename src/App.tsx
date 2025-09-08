import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { API_BASE_URL } from "./config";

function App() {
  const [count, setCount] = useState(0)
  const [pingResult, setPingResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePing = async () => {
    setIsLoading(true)
    try {
      const result = await getPublicPing()
      setPingResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setPingResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>Welcome, Kleber Saavedra!</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <br />
        <button onClick={handlePing} disabled={isLoading}>
          {isLoading ? 'Pinging...' : 'Test Public Ping'}
        </button>
        {pingResult && (
          <pre style={{ textAlign: 'left', marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.8rem' }}>
            {pingResult}
          </pre>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export async function getPublicPing() {
  const r = await fetch(`${API_BASE_URL}/api/public/ping`);
  if (!r.ok) throw new Error(`Ping failed: ${r.status}`);
  return r.json();
}

export default App

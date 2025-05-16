import { useEffect, useState } from 'react'
import api from '../api'

export default function APIKeys() {
  const [keys, setKeys] = useState<string[]>([])
  const [newKey, setNewKey] = useState('')

  useEffect(() => {
    api.get<string[]>('/apikeys').then(r => setKeys(r.data))
  }, [])

  const genKey = async () => {
    const { data } = await api.post<{ key: string }>('/apikeys')
    setNewKey(data.key)
    setKeys([data.key, ...keys])
  }

  return (
    <div className="container">
      <h2>API Key Management</h2>
      <button onClick={genKey}>Generate New Key</button>
      {newKey && <p>Your new key: <code>{newKey}</code></p>}
      <ul>
        {keys.map(k => <li key={k}><code>{k}</code></li>)}
      </ul>
    </div>
  )
}
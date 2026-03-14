import './App.css'
import { useGetVideosQuery } from './store/api/videosApi'

function App() {
  const { data, isLoading, error } = useGetVideosQuery()

  if (isLoading) {
    return (
      <main className="app">
        <h1>Videos</h1>
        <p>Loading…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="app">
        <h1>Videos</h1>
        <p>Failed to load videos.</p>
      </main>
    )
  }

  const files = data?.files ?? []

  return (
    <main className="app">
      <h1>Videos</h1>
      {files.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <ul className="video-list">
          {files.map((name) => (
            <li key={name}>
              <a href={`/video/${name}`}>{name}</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App

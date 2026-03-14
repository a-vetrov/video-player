import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './store'

export function render(_url: string) {
  const html = renderToString(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
  return { html }
}

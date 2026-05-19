import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { HomePage } from './pages/HomePage.jsx'
import { BoardPage } from './pages/BoardPage.jsx'
import ErrorBoundary from './components/UI/ErrorBoundary.jsx'

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
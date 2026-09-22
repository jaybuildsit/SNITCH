import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { Provider, useSelector } from 'react-redux'
// import { store } from './app.store'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'


function App() {

  const { handleGetMe } = useAuth();

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    handleGetMe();
  }, [])

  return (
    <>
      <RouterProvider router={routes} />
    </>

  )
}

export default App
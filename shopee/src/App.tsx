import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRouteElements from './useRouteElements'
import { useContext, useEffect } from 'react'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'

function App() {
  const routeElements = useRouteElements()
  const { resetCurrentProfile } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLocalStorage', resetCurrentProfile)

    return () => {
      LocalStorageEventTarget.removeEventListener('clearLocalStorage', resetCurrentProfile)
    }
  }, [resetCurrentProfile])
  return (
    <>
      {routeElements}
      <ToastContainer />
    </>
  )
}

export default App

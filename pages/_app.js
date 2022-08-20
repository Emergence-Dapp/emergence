import '../styles/globals.css'
import { ClientContextProvider } from '../contexts/ClientContext.jsx'

function MyApp({ Component, pageProps }) {
  return <ClientContextProvider><Component {...pageProps} /></ClientContextProvider>
}

export default MyApp

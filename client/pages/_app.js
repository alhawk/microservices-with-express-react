import buildClient from '../api/buildClient'
import Header from '../components/header'
import '../styles/globals.css'


const App = ({Component, pageProps, currentUser}) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <Component {...pageProps}/>
    </div>
  )
}

App.getInitialProps = async (context) => {
  console.log(context)
  const client = buildClient(context.ctx)
  const {data} = await client.get('/api/users/currentuser')

  let pageProps = {}
  if (context.Component.getInitialProps) {
   pageProps = await context.Component.getInitialProps(context.ctx)
  }

  return {
    pageProps,
    ...data
  }
}

export default App
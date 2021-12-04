import buildClient from "../api/buildClient";

const Home = ({currentUser}) => {
  return (
    <div>
      {
        currentUser ? (
          <div>User: {JSON.stringify(currentUser)}</div>
        ) : <div>You are not signed in</div>
      }
    </div>
  );
}

Home.getInitialProps = async (context) => {
  const client = buildClient(context)
  const {data} = await client.get('/api/users/currentuser')
  return data
}

export default Home;
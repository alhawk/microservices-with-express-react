import buildClient from "../api/buildClient";

const Home = ({currentUser, tickets}) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="bg-blue-500 py-3 px-6 text-white text-xl">Title</th>
            <th className="bg-blue-300 py-3 px-6 text-white text-xl">Price</th>
          </tr>
        </thead>
        <tbody>
          {
            tickets.map(el => {
              return(
                <tr>
                  <td className="py-3 px-6 text-xl border-b-2">{el.title}</td>
                  <td className="py-3 px-6 text-xl border-b-2">{el.price}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

Home.getInitialProps = async (context) => {
  const client = buildClient(context)
  const {data} = await client.get('/api/tickets')
  console.log(data)
  return {tickets: data}
}

export default Home;
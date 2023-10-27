// WE MADE THIS COMPONENT A SERVER COMPONENT, so we don't use react useState or other hooks, but we can import client component inside this
import { ConnectButton } from '../components/Client/ConnectButton'
import { Connected } from '../components/Client/Connected'
import GetAllVotes from "./../components/Client/GetAllVotes"
import CreateVote from '../components/Client/CreateVote'
export function Page() {

  return (
    <>
      <div style={{ "display": "flex" }}>
        <h1>VOTING SYSTEM</h1>
        <ConnectButton />
      </div>

      <Connected>
        <CreateVote/>
        <GetAllVotes/>
        
      </Connected>
    </>
  )
}

export default Page
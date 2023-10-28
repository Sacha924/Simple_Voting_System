// WE MADE THIS COMPONENT A SERVER COMPONENT, so we don't use react useState or other hooks, but we can import client component inside this
import { ConnectButton } from '../components/Client/ConnectButton'
import { Connected } from '../components/Client/Connected'
import GetAllVotes from "./../components/Client/GetAllVotes"
import CreateVote from '../components/Client/CreateVote'
import "./../styles/global.css"

export default function Page() {
  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold">VOTING SYSTEM</h1>
          <ConnectButton />
        </div>

        <Connected>
          <GetAllVotes />
          <CreateVote />
        </Connected>
      </div>
    </>
  )
}


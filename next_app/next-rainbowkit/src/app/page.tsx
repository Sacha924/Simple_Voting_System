import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import GetAllVotes from "./../components/Client/GetAllVotes"

export function Page() {

  return (
    <>
      <div style={{ "display": "flex" }}>
        <h1>VOTING SYSTEM</h1>
        <ConnectButton />
      </div>

      <Connected>
        <GetAllVotes/>
      </Connected>
    </>
  )
}

export default Page
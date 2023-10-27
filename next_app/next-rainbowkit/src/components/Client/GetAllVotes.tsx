'use client'

import { useContractRead, useContractWrite, useWalletClient } from 'wagmi'
import { wagmiContractConfig } from './../contracts'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'



export default function GetAllVotes() {
    const [personalVoteDisplay, setPersonalVoteDisplay] = useState(false)
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const { data, isRefetching, refetch } = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getVotes',
    })
    const { data: walletClient } = useWalletClient()

    const { data: votedId } = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getMyVotes',
        account: walletClient?.account,
    })

    const { write, error: errorCast } = useContractWrite({
        ...wagmiContractConfig,
        functionName: 'castVote',
        account: walletClient?.account,
    })

    const toggleErrorModal = () => {
        setIsErrorModalOpen(!isErrorModalOpen);
    };

    useEffect(() => {
        if (errorCast) {
            toggleErrorModal();
        }
    }, [errorCast]);

    const renderVote = (index: number) => {
        return (
            <div style={{
                padding: '16px',
                margin: '8px 0',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0',
            }} key={index}>
                <p><strong>Vote ID:</strong> {(data ? data[0][index] : 0).toString()}</p>
                <p><strong>Proposal Date:</strong> {new Date(Number(data ? data[1][index] : 0) * 1000).toLocaleString()}</p>
                <p><strong>Deadline:</strong> {new Date(Number(data ? data[2][index] : 0) * 1000).toLocaleString()}</p>
                <p><strong>Description:</strong> {data ? data[3][index] : "N/A"}</p>
                <p><strong>Yes Count:</strong> {(data ? data[4][index] : 0).toString()}</p>
                <p><strong>No Count:</strong> {(data ? data[5][index] : 0).toString()}</p>
                <img width="48" height="48" src="https://img.icons8.com/emoji/48/thumbs-up-medium-skin-tone.png" alt="thumbs-up-medium-skin-tone" onClick={() => write({
                    args: [data ? data[0][index] : BigInt(0), true],
                })} />
                <img width="48" height="48" src="https://img.icons8.com/emoji/48/thumbs-down-medium-dark-skin-tone.png" alt="thumbs-down-medium-dark-skin-tone" onClick={() => write({
                    args: [data ? data[0][index] : BigInt(0), false],
                })} />

            </div>
        );
    };

    function DisplayError({ error }: any) {
        if (!error) return null;

        const errorMessage = error.message.split(":")[1]?.trim();
        const contractFunction = error.message.match(/function: (.+?)\(/)?.[1];
        const args = error.message.match(/args: (.+?)\)/)?.[1] + ")"; 
        const sender = error.message.match(/sender: (.+)/)?.[1];

        return ReactDOM.createPortal(
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    background: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                    maxWidth: '500px',
                    width: '100%',
                }}>
                    <h4>Error Occurred!</h4>
                    <p><strong>Message:</strong> {errorMessage}</p>
                    <p><strong>Function:</strong> {contractFunction}</p>
                    <p><strong>Arguments:</strong> {args}</p>
                    <p><strong>Sender:</strong> {sender}</p>
                    <p>Refer to the <a href="https://viem.sh/docs/contract/simulateContract.html">documentation</a> for more details.</p>
                    <button onClick={toggleErrorModal}>Close</button>
                </div>
            </div>,
            document.body
        );
    };


    return (
        <>
            <h1>Votes of the Community:</h1>
            <p>Sort by
                <button onClick={() => setPersonalVoteDisplay(false)}> ALL </button>
                <button onClick={() => setPersonalVoteDisplay(true)}> My Contribution </button>
            </p>

            {!personalVoteDisplay && data && data[0] && data[0].map((_, index) => renderVote(index))}
            {personalVoteDisplay && data && data[0] && data[0].map((_, index) => {
                if (votedId && votedId.includes(BigInt(index))) {
                    return renderVote(index);
                }
                return null;
            })}

            <button
                disabled={isRefetching}
                onClick={() => refetch()}
                style={{ marginLeft: 4 }}
            >
                {isRefetching ? 'loading...' : 'refetch'}
            </button>
            {isErrorModalOpen && <DisplayError error={errorCast} />}
        </>
    );
}


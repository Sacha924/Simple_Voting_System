'use client'

import { useContractRead, useContractWrite, useWalletClient } from 'wagmi'
import { wagmiContractConfig } from './../contracts'
import { BaseError } from 'viem'
import { useState } from 'react'



export default function GetAllVotes() {
    const [personalVoteDisplay, setPersonalVoteDisplay] = useState(false)
    const { data, error, isRefetching, refetch } = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getVotes',
    })
    const { data: walletClient } = useWalletClient()

    const { data: votedId } = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getMyVotes',
        account: walletClient?.account,
    })

    const { write, data: dataCast, error: errorCast, isLoading, isError } = useContractWrite({
        ...wagmiContractConfig,
        functionName: 'castVote',
        account: walletClient?.account,
    })


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
            {error && <div>{(error as BaseError).shortMessage}</div>}
        </>
    );
}


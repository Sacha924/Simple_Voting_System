'use client'

import { useContractRead, useWalletClient } from 'wagmi'
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
^


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

                {/* RENDRE LE YES COUNT ET LE NO COUNT CLICKABLE POUR VOTER DIRECTEMENT, SI QUAND ON CLIQUE CELA REVERT ON RENVOIE UN MESSAGE D ERREUR 
                DISANT QUE SOIT LE GARS A DEJA VOTE SOIT LA DEADLINE EST FINIE
                OU ALORS MIEUX : rendre le truc non clickable quand la deadline est passé, autrement dit si datetime now > deadline */}
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


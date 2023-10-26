'use client'

import { useContractRead } from 'wagmi'
import { wagmiContractConfig } from './../contracts'
import { BaseError } from 'viem'


export default function GetAllVotes() {
    const { data, error, isRefetching, refetch } = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getVotes',
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

            </div>
        );
    };

    return (
        <>
            <h1>Votes of the Community:</h1>
            {data && data[0] && data[0].map((_, index) => renderVote(index))}
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


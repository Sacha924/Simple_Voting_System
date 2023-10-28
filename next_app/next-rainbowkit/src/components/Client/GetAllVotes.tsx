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
            <div className="relative p-4 m-2 border border-gray-300 rounded bg-gray-100 flex flex-col items-start min-w-[450px]" key={index}>
                <div className="absolute top-2 right-2 flex space-x-2">
                    <img width="48" height="48" src="https://img.icons8.com/ios-glyphs/30/thumb-up--v1.png" alt="thumbs-up-medium-skin-tone" onClick={() => write({
                        args: [data ? data[0][index] : BigInt(0), true],
                    })} />
                    <img width="48" height="48" src="https://img.icons8.com/ios-glyphs/30/thumbs-down.png" alt="thumbs-down-medium-dark-skin-tone" onClick={() => write({
                        args: [data ? data[0][index] : BigInt(0), false],
                    })} />
                </div>
                <p><span className="font-bold">Vote ID: </span>{(data ? data[0][index] : 0).toString()}</p>
                <p><span className="font-bold">Proposal Date: </span>{new Date(Number(data ? data[1][index] : 0) * 1000).toLocaleString()}</p>
                <p><span className="font-bold">Deadline: </span>{new Date(Number(data ? data[2][index] : 0) * 1000).toLocaleString()}</p>
                <p><span className="font-bold">Description: </span>{data ? data[3][index] : "N/A"}</p>
                <p><span className="font-bold">Yes Count: </span>{(data ? data[4][index] : 0).toString()}</p>
                <p><span className="font-bold">No Count: </span>{(data ? data[5][index] : 0).toString()}</p>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded max-w-lg w-full">
                    <h4>Error Occurred!</h4>
                    <p><strong>Message:</strong> {errorMessage}</p>
                    <p><strong>Function:</strong> {contractFunction}</p>
                    <p><strong>Arguments:</strong> {args}</p>
                    <p><strong>Sender:</strong> {sender}</p>
                    <p>Refer to the <a href="https://viem.sh/docs/contract/simulateContract.html">documentation</a> for more details.</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full" onClick={toggleErrorModal}>Close</button>
                </div>
            </div>,
            document.body
        );
    };


    return (
        <>
            <h1 className="text-xl font-bold mb-4">Votes of the Community:</h1>
            <p className="mb-4">Sort by
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2" onClick={() => setPersonalVoteDisplay(false)}> ALL </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2" onClick={() => setPersonalVoteDisplay(true)}> My Contribution </button>
            </p>

            <div className="flex flex-wrap justify-start">
                {!personalVoteDisplay && data && data[0] && data[0].map((_, index) => renderVote(index))}
                {personalVoteDisplay && data && data[0] && data[0].map((_, index) => {
                    if (votedId && votedId.includes(BigInt(index))) {
                        return renderVote(index);
                    }
                    return null;
                })}
            </div>

            <button
                className={`ml-4 px-4 py-2 rounded-full ${isRefetching ? 'bg-gray-500' : 'bg-blue-500 text-white'}`}
                disabled={isRefetching}
                onClick={() => refetch()}
            >
                {isRefetching ? 'loading...' : 'refetch'}
            </button>
            {isErrorModalOpen && <DisplayError error={errorCast} />}
        </>
    );
}
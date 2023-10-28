'use client'
import React, { useEffect, useState } from 'react'
import { BaseError } from 'viem'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

import { wagmiContractConfig } from './../contracts'
import { stringify } from '../../utils/stringify'

export default function CreateVote() {
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        deadline: "",
        description: "",
    });
    const [unixTime, setUnixTime] = useState(Math.floor(Date.now() / 1000));
    const [buttonText, setButtonText] = useState('Create a Proposal');
    const { write, data, error, isLoading, isError } = useContractWrite({
        ...wagmiContractConfig,
        functionName: 'proposeVote',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({ hash: data?.hash })

    useEffect(() => {
        const intervalId = setInterval(() => {
            setUnixTime(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        write({
            args: [BigInt(formData.deadline), formData.description],
        })
    }

    function handleChange(event: { target: { name: string; value: any; }; }) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    return (
        <div className="p-4">
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => {
                    if (showModal) {
                        setButtonText('Create a Proposal')
                    } else {
                        setButtonText('Close')
                    }
                    setShowModal(!showModal)
                }}
            >
                {buttonText}
            </button>
            {showModal ? (
                <div className="mt-4">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className='text-gray-500'>Deadline</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.deadline}
                                onChange={handleChange}
                                placeholder={unixTime.toString()}
                                type="text"
                                name="deadline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className='text-gray-500'>Description</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                type="text"
                                name="description"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
            {isLoading && <div className="text-blue-500">Check wallet...</div>}
            {isPending && <div className="text-blue-500">Transaction pending...</div>}
            {isSuccess && (
                <div className="mt-4">
                    <div>Transaction Hash: {data?.hash}</div>
                    <div>
                        Transaction Receipt: <pre className="bg-gray-100 p-2 rounded">{stringify(receipt, null, 2)}</pre>
                    </div>
                </div>
            )}
            {isError && <div className="text-red-500">{(error as BaseError)?.shortMessage}</div>}
        </div>
    )
}
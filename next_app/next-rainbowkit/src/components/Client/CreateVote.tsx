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
        <div>
            <button onClick={() => {
                if (showModal) {
                    setButtonText('Create a Proposal')
                } else {
                    setButtonText('Close')
                }
                setShowModal(!showModal)
            }
            }>
                {buttonText}
            </button>
            {showModal ? (
                <>
                    <form onSubmit={handleSubmit}>
                        <input
                            value={formData.deadline}
                            onChange={handleChange}
                            placeholder={unixTime.toString()}
                            type="text"
                            name="deadline"
                            required
                        />
                        <input
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            type="text"
                            name="description"
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </>
            ) : null}
            {isLoading && <div>Check wallet...</div>}
            {isPending && <div>Transaction pending...</div>}
            {isSuccess && (
                <>
                    <div>Transaction Hash: {data?.hash}</div>
                    <div>
                        Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
                    </div>
                </>
            )}
            {isError && <div>{(error as BaseError)?.shortMessage}</div>}
        </div>
    )
}

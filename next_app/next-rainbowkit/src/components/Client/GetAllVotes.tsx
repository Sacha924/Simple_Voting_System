'use client'

import { useContractRead } from 'wagmi'
import { wagmiContractConfig } from './../contracts'
import { BaseError } from 'viem'


export default function GetAllVotes() {
    const { data, error, isRefetching, refetch } = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getVotes',
    })

    // l'idée c'est dans le main component j'ai une variable qui se set à True ou False en fonction de si le user veut les votes auquels il a participé ou tous les votes. S'il veut que les votes auxquels il a participé dans ce cas ma variable est True et est passé dans ce component et je vais faire un filter pour afficher uniquement les votes dont les ids sont dans le tableau d'id. Mais pour le moment je pense qu'il y a un problème avec le contrat.
    const { data: votedId } = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getMyVotes',
    })
    console.log(votedId)


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


import bs58 from 'bs58'
import type { Connection, Transaction } from '@solana/web3.js'

const MAX_BLOCK_HEIGHT = 150

interface SendTransactionWithRetryArgs {
  connection: Connection
  transaction?: Transaction
  maxHeight: number
  retryInterval?: number
  skipPreflight?: boolean
  skipSimulation?: boolean
}

export async function sendTransactionWithRetry({
  connection,
  transaction,
  maxHeight,
  retryInterval = 2000,
  skipPreflight = false,
  skipSimulation = false,
}: SendTransactionWithRetryArgs): Promise<string | null> {
  let signature = bs58.encode(transaction.signature)
  let transactionBuffer = transaction.serialize()

  let simulationPromise = null
  if (!skipSimulation)
    simulationPromise = connection.simulateTransaction(transaction)

  while (true) {
    try {
      await connection.sendRawTransaction(transactionBuffer, {
        preflightCommitment: 'confirmed',
        skipPreflight,
      })
    } catch (err: any) {
      console.log('error during retry:', err?.message || err)
    }

    if (simulationPromise) {
      let {
        value: { err, logs },
      } = await simulationPromise
      if (err) {
        console.error(logs.join('\n'))
        console.error(transactionBuffer.toString('base64'))
        console.error('error simulating transaction:', err)
        throw new Error(`error simulating transaction ${err}`)
      }
      simulationPromise = null
    }
    await new Promise(resolve => setTimeout(resolve, retryInterval))

    const status = await connection.getSignatureStatus(signature)
    if (status?.value?.confirmationStatus === 'confirmed') return signature

    const { lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    if (lastValidBlockHeight > maxHeight + MAX_BLOCK_HEIGHT) return null
  }
}

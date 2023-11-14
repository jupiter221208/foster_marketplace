import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useDispatch } from 'react-redux'

import { type Connection, type TransactionInstruction, Transaction } from '@solana/web3.js'

export const useViewport = () => {
  const [viewport, setViewport] = useState('lg')

  useEffect(() => {
    if (window.innerWidth > 1536) {
      setViewport('2xl')
    } else if (window.innerWidth > 1280 && window.innerWidth <= 1536) {
      setViewport('xl')
    } else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
      setViewport('lg')
    } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
      setViewport('md')
    } else if (window.innerWidth >= 640 && window.innerWidth <= 768) {
      setViewport('sm')
    } else {
      setViewport('xs')
    }
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      if (window.innerWidth > 1536) {
        setViewport('2xl')
      } else if (window.innerWidth > 1280 && window.innerWidth <= 1536) {
        setViewport('xl')
      } else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
        setViewport('lg')
      } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
        setViewport('md')
      } else if (window.innerWidth >= 640 && window.innerWidth <= 768) {
        setViewport('sm')
      } else {
        setViewport('xs')
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [])
  return viewport
}

export const namePublicFile = name => {
  let re = /(?:\.([^.]+))?$/
  let ext = re.exec(name)[1]
  return `${uuidv4()}.${ext}`
}

export const b64toBlob = dataURI => {
  var byteString = atob(dataURI.split(',')[1])
  var ab = new ArrayBuffer(byteString.length)
  var ia = new Uint8Array(ab)

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/jpeg' })
}

export const getBase64FromUrl = async url => {
  const data = await fetch(url)
  const blob = await data.blob()
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result
      resolve(base64data)
    }
  })
}

export const useDetectRouterPath = router => {
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'set', isLoading: false })
    }, 400)
  }, [router.asPath])
}

const COINGECKO_SOL_TO_USD_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
export const fetchSolToUsdRate = async () => {
  return fetch(COINGECKO_SOL_TO_USD_API_URL)
    .then(r => r.json())
    .then(({ solana: { usd } }) => usd)
}

export function addUrlSearchParams(
  base: string | URL,
  searchParams: Record<string, undefined | null | string | number | (string | number)[]>
): URL {
  let url = new URL(base.toString())
  for (let [key, value] of Object.entries(searchParams))
    if (value !== undefined && value !== null) url.searchParams.append(key, value.toString())

  return url
}

export function addNonEmptySearchParams(
  url: Parameters<typeof addUrlSearchParams>[0],
  params: Parameters<typeof addUrlSearchParams>[1]
): ReturnType<typeof addUrlSearchParams> {
  for (let k in params) if (params[k] === '') delete params[k]
  return addUrlSearchParams(url, params)
}

export const ensureMaxDecimals = (n, decimals) => {
  let multiplier = 10 ** decimals
  return Math.floor(n * multiplier) / multiplier
}

export async function trySendTransaction(
  connection: Connection,
  tx: Transaction,
  signTransaction: (tx: Transaction) => Promise<Transaction>,
  { retries = 5 }: { retries?: number } = {}
): Promise<string | null> {
  for (let i = 0; i < 5; i++) {
    console.log(`attempting to send proposal to chain: attempt ${i + 1} of 5`)

    let latestBlockhash = await connection.getLatestBlockhash()
    tx.recentBlockhash = latestBlockhash.blockhash

    let signedTx = await signTransaction(tx)
    let signature = await connection.sendRawTransaction(signedTx.serialize())
    try {
      await connection.confirmTransaction({
        signature,
        ...latestBlockhash,
      })
      return signature
    } catch (e: any) {
      console.error(`  failed to send to chain: ${e.message}`, e)
    }
  }

  return null
}

// TODO: test code
export async function splitIntoTransactions(instructions: TransactionInstruction[][]): Promise<Transaction[]> {
  instructions = [...instructions]

  let transactions: Transaction[] = []
  while (instructions.length > 0) {
    let tx = new Transaction()
    let index = 0
    while (index < instructions.length) {
      tx.add(...instructions[index])
      try {
        tx.serialize({ requireAllSignatures: false })
        index++
      } catch (e: any) {
        if (!e.message.startsWith('Transaction too large')) throw e
        else if (tx.instructions.length == instructions[index].length)
          throw new Error(`transaction group ${index} too big for one transaction`)
        tx.instructions.splice(-1, instructions[index].length)
        tx.compileMessage()
      }
    }

    transactions.splice(0, index)
    transactions.push(tx)
  }

  return transactions
}

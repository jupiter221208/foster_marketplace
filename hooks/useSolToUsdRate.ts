import { useEffect, useState } from 'react'
import { fetchSolToUsdRate } from 'utils'

let solToUsdRate = 0
let useCount = 0
let refreshIntervalId: null | ReturnType<typeof setInterval> = null

let FETCH_SOL_USD_RATE_PROMISE: Promise<number> | null = null
async function debounceFetchSolToUsdRate(): Promise<number> {
  if (!FETCH_SOL_USD_RATE_PROMISE)
    FETCH_SOL_USD_RATE_PROMISE = fetchSolToUsdRate().then(rate => {
      solToUsdRate = rate
      FETCH_SOL_USD_RATE_PROMISE = null
      return rate
    })
  return FETCH_SOL_USD_RATE_PROMISE
}

export function useSolToUsdRate() {
  const [localSolToUsdRate, setLocalSolToUsdRate] = useState<number>(solToUsdRate)
  const refreshValue = async (): Promise<number> => {
    let rate = await debounceFetchSolToUsdRate()
    setLocalSolToUsdRate(rate)
    return rate
  }
  if (solToUsdRate === 0) refreshValue()

  useEffect(() => {
    // refresh rate every 10 minutes
    if (useCount <= 0) {
      refreshIntervalId = setInterval(refreshValue, 10 * 60 * 1000)
    }
    useCount++

    return () => {
      useCount--
      if (useCount <= 0) {
        clearInterval(refreshIntervalId)
        refreshIntervalId = null
      }
    }
  }, [])

  function solToUsdWithSlippage(slippage = 0.02) {
    return localSolToUsdRate * (1 - slippage)
  }

  return {
    solToUsdRate: localSolToUsdRate,
    refreshValue,
    solToUsdWithSlippage,
  }
}

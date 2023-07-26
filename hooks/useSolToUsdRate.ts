import { useEffect, useState } from 'react'
import { fetchSolToUsdRate } from 'utils'

let solToUsdRate = 0
let useCount = 0
let refreshIntervalId: null | ReturnType<typeof setInterval> = null

export function useSolToUsdRate() {
  const refreshValue = async (): Promise<number> => {
    solToUsdRate = await fetchSolToUsdRate()
    return solToUsdRate
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

  return {
    solToUsdRate,
    refreshValue,
  }
}

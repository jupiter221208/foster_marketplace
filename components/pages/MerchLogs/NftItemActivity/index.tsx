import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import { useViewport } from 'utils'

// json

// functions

// styles
import styles from './index.module.scss'

// apis
import LoadingModal from 'components/Modal/LoadingModal'
import { stringLengthValidate } from 'utils/strings'

const NftItemActivity = props => {
  const { avtivities, type, isLoading, action } = props
  const viewport = useViewport()

  const [isMounted, setIsMounted] = useState(false)
  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    setLoading(isLoading)
    if (isLoading === false) {
      setList(avtivities)
      setTimeout(() => {
        setLoading(false)
        setIsMounted(true)
      }, 1000)
    }
  }, [isLoading, avtivities])

  useEffect(() => {
    let length = searchWord?.length
    if (length >= 0) {
      const results = avtivities.filter(({ nft_name }) => {
        return nft_name.includes(searchWord)
      })
      setList(results)
    } else {
      if (length === 0) {
        setList(avtivities)
      }
    }
  }, [searchWord])

  return (
    <div className={styles.container}>
      {loading && (
        <div className="mt-10">
          <LoadingModal open={loading} />
        </div>
      )}

      {!loading && list.length > 0 && (
        <SearchSection
          placeholder={'Search'}
          searchWord={searchWord}
          setSearchWord={value => setSearchWord(value.toString())}
          period={period}
          setPeriod={setPeriod}
        />
      )}

      {list.length > 0 && (
        <div className="mt-[10px]">
          <TableSections data={list} type={type} action={action} />
        </div>
      )}
    </div>
  )
}

export default NftItemActivity

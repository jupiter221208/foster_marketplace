import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'

// apis
import OutlineButton from 'components/Button/OutlineButton'

const NftItemActivity = props => {
  const { avtivities, type, isLoading, action, actionAll } = props

  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [period, setPeriod] = useState('all')

  useEffect(() => {
    setList(avtivities)
  }, [avtivities])

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
      <div className="w-full lg:max-w-[760px] hidden lg:flex justify-between">
        {list.length > 0 && (
          <SearchSection
            placeholder={'Search'}
            searchWord={searchWord}
            setSearchWord={value => setSearchWord(value.toString())}
            period={period}
            setPeriod={setPeriod}
          />
        )}
        {list.length > 0 && (
          <OutlineButton
            width={138}
            borderColor={'var(--back-btn-border-mobile)'}
            label={type === 'enabled' ? 'Disable All' : 'Enable All'}
            onClick={() => {
              actionAll()
            }}
          />
        )}
      </div>

      {list.length > 0 && (
        <div className="lg:max-w-[760px] w-full mt-[10px]">
          <TableSections data={list} type={type} action={action} actionAll={actionAll} />
        </div>
      )}
      {!isLoading && list.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[0px]">
          <div className={styles.noArtwork}>{'No artworks currently ' + type}</div>
          <div className={styles.noData}>{'This tab displays the artwork you created with Creator Studio ' + type}</div>
        </div>
      )}
    </div>
  )
}

export default NftItemActivity

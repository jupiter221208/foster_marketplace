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
  const { activities, type, isLoading, action, actionAll } = props

  const [searchWord, setSearchWord] = useState<any>('')
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    setList(activities)
  }, [activities])

  useEffect(() => {
    let length = searchWord?.length
    if (length > 0) {
      const results = activities.filter(({ nft_name }) => {
        return nft_name.toLowerCase().includes(searchWord.toLowerCase())
      })
      setList(results)
    } else {
      if (length === 0) {
        setList(activities)
      }
    }
  }, [searchWord])

  return (
    <div className={styles.container}>
      <div className="w-full lg:max-w-[760px] hidden lg:flex justify-between">
        {activities.length > 0 && (
          <SearchSection
            placeholder={'Search'}
            searchWord={searchWord}
            setSearchWord={value => setSearchWord(value.toString())}
          />
        )}
        {activities.length > 0 && (
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
      {!isLoading && activities.length === 0 && searchWord.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[0px]">
          <div className={styles.noArtwork}>
            {type === 'enabled' ? 'No artworks currently enabled' : 'No eligible artworks detected'}
          </div>
          <div className={styles.noData}>
            {type === 'enabled'
              ? 'This tab displays the artwork you created with Creator Studio enabled'
              : 'This tab displays any artworks you created that are eligible for Creator Studio'}
          </div>
        </div>
      )}
    </div>
  )
}

export default NftItemActivity

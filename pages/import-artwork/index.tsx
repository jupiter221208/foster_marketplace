import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// custom
import { useAuthentication } from 'hooks/useAuthentication'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import LoadingElement from 'pages/profile/LoadingComponent/LoadingElement'
import ImageWithFoster from 'components/ImageWithFoster'

// solana
import { getMyNFTs } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import { useWallet } from '@solana/wallet-adapter-react'

// resources
import SearchGrayIcon from 'assets/icons/search-gray.svg?component'
import CheckedIcon from 'assets/icons/checked-20x20.svg?component'
import UncheckedIcon from 'assets/icons/unchecked-20x20.svg?component'

// styles
import styles from './index.module.scss'

// apis
import DashboardAPI from 'apis/dashboard'
import nftAPI from 'apis/nfts'

const ImportArtwork = () => {
  const { connected, publicKey } = useWallet()
  const router = useRouter()
  const { profileInfo } = useAuthentication()
  const { metaplex } = useMetaplex()
  const [loaded, setLoaded] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importedSuccess, setImportedSuccess] = useState(false)
  const [allList, setAllList] = useState([])
  const [nftList, setNftList] = useState([])
  const [searchWord, setSearchWord] = useState('')
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!publicKey || !connected) return
    ;(async () => {
      let nfts = await getMyNFTs(metaplex)
      let params = {
        sort: 'price-descending',
        page: 1,
        per_page: 'all',
      }
      DashboardAPI.getArtworkList(publicKey.toBase58(), params, false).then(
        response => {
          let addressListDB = []
          response.map(res => addressListDB.push(res.tokenId))
          let eligibleNfts = nfts.filter(
            item => item.name?.length > 0 && !addressListDB.some(address => item.mintAddress === address)
          )
          let newNfts = []
          eligibleNfts.map(nft => newNfts.push({ ...nft, checked: false }))
          setNftList(newNfts)
          setAllList(newNfts)
          setLoaded(true)
        },
        error => {}
      )
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaplex, connected, publicKey])

  const checkItem = index => {
    let newList = [...nftList]
    newList[index].checked = !newList[index].checked
    let selected = newList.filter(item => item.checked === true)
    setNftList(newList)
    setCount(selected.length)
  }

  const checkAll = () => {
    let newList = [...allList]
    newList.map(item => (item.checked = true))
    setNftList(newList)
    setCount(newList.length)
  }

  const checkNone = () => {
    let newList = [...allList]
    newList.map(item => (item.checked = false))
    setNftList(newList)
    setCount(0)
  }

  const searchNft = searchText => {
    if (searchText === '') {
      setNftList(allList)
      return
    }
    let newList = [...allList]
    setNftList(newList.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())))
  }

  const importArtwork = () => {
    setImporting(true)
    let selected = nftList.filter(item => item.checked === true)
    nftAPI.batchIndex(selected.map(({ mintAddress }) => mintAddress.toString())).then(
      response => {
        setImporting(false)
        setImportedSuccess(true)
      },
      error => {
        setImporting(false)
      }
    )
  }

  return (
    <div className="g-container">
      <div className={styles.title}>Import Artwork</div>
      <div className={styles.desc}>Import your artworks minted on other platforms.</div>
      <div className="w-full flex justify-center mt-[30px]">
        {!loaded ? (
          <div className={styles.loadingScreen}>
            <LoadingElement text="Loading artwork" />
          </div>
        ) : importing ? (
          <div className={styles.loadingScreen}>
            <LoadingElement text="Importing artwork" />
          </div>
        ) : importedSuccess ? (
          <div className={styles.successScreen}>
            <div className="flex flex-col items-center">
              <div className={styles.success}>Success!</div>
              <div className={styles.successMsg}>Your artworks have been imported successfully.</div>
              <div className={styles.viewProfile} onClick={() => router.push(`/${profileInfo?.username}`)}>
                View Profile
              </div>
            </div>
          </div>
        ) : loaded ? (
          <div className={styles.mainScreen}>
            <div className="w-full">
              <div className={styles.searchArea}>
                <div className="w-[14px]">
                  <SearchGrayIcon className="cursor-pointer" />
                </div>
                <input
                  className={styles.inputArea}
                  value={searchWord}
                  placeholder={'Search artwork...'}
                  onChange={event => {
                    searchNft(event.target.value)
                    setSearchWord(event.target.value)
                  }}
                />
              </div>
            </div>
            <div className="w-full flex justify-between items-center mt-[30px]">
              <div className="flex gap-[15px]">
                <div className={styles.selectAll} onClick={() => checkAll()}>
                  Select All
                </div>
                <div className={styles.selectNone} onClick={() => checkNone()}>
                  Select None
                </div>
              </div>
              <div className={styles.artworkSelected}>
                {count} of {allList.length} artworks selected
              </div>
            </div>
            <div className="w-full flex justify-between mt-[30px]">
              <div className={styles.tableHeader}>Artwork</div>
              <div className={styles.tableHeader}>Select</div>
            </div>

            <div className="w-full h-[390px] mt-[15px] overflow-auto">
              {nftList.map((item, index) => (
                <div key={index} className={styles.row}>
                  <div className="flex items-center h-[50px] gap-[30px]">
                    <div className="w-[50px] h-[50px] rounded-[10px] overflow-hidden">
                      <ImageWithFoster width={100} src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className={styles.nftName}>{item.name}</div>
                  </div>
                  <div onClick={() => checkItem(index)}>
                    {item.checked === true ? <CheckedIcon /> : <UncheckedIcon />}
                  </div>
                </div>
              ))}
            </div>

            <div className={`${styles.importBtn} mt-[30px]`} onClick={() => importArtwork()}>
              Import {count} Artworks
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default ImportArtwork

ImportArtwork.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

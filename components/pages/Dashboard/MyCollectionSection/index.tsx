import React, { useEffect, useState } from 'react'

// next components

// components
import DashboardCollectionCard from 'components/Card/DashboardCollectionCard'
import LoadingModal from 'components/Modal/LoadingModal'

// styles
import styles from './index.module.scss'

// redux
import { useDispatch } from 'react-redux'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyCollections } from 'utils/collection.util'
import NoDataSection from '../NoDataSection'
import LoadingComponent from 'pages/explore/LoadingComponent'
import { NftData } from 'types/nft'

const MyCollectionSection = () => {
  const dispatch = useDispatch()

  const [collections, setCollections] = useState([])
  const [isCollectionLoaded, setIsCollectionLoaded] = useState(false)
  const { metaplex: mx } = useMetaplex()
  const [rowCount, setRowCount] = useState(12)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [myCollections, setMyCollections] = useState<NftData[]>([])
  useEffect(() => {
    const getCollections = async () => {
      const collections = await getMyCollections(mx)
      let publicKey = mx.identity().publicKey
      setCollections(collections.filter(({ updateAuthorityAddress }) => updateAuthorityAddress?.equals(publicKey)))
      setIsCollectionLoaded(true)
    }
    if (mx) getCollections()
  }, [mx])

  useEffect(() => {
    if (collections.length > 0) {
      setMyCollections(collections.slice(0, rowCount))
      if (collections.length > rowCount) setIsVisibleFetching(true)
    }
  }, [collections])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (myCollections.length + rowCount > collections.length) {
        setMyCollections([...myCollections, ...collections.slice(myCollections.length, collections.length)])
        setIsVisibleFetching(false)
      } else {
        setMyCollections([
          ...myCollections,
          ...collections.slice(myCollections.length, myCollections.length + rowCount),
        ])
        setIsVisibleFetching(true)
      }
    }
  }, [isFetching])

  const getCategory = attributes => {
    if (!Array.isArray(attributes)) return []
    return attributes.map(({ value }) => value).filter(category => !!category)
  }
  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-[11px] lg:gap-[32px] grid grid-cols-12">
        {isCollectionLoaded &&
          myCollections.map((item, index) => (
            <div className="col-span-6 lg:col-span-3" key={index}>
              <DashboardCollectionCard
                image={item.json?.image}
                nftName={item.json?.name}
                artistAddress={item.creators[0]?.address.toString()}
                mintAddress={item.mintAddress.toString()}
                link={`/collection/${item.mintAddress.toString()}`}
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                }}
              />
            </div>
          ))}
      </div>
      {isCollectionLoaded && isVisibleFetching && (
        <div className="w-full mt-[-50px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}
      <div className="col-span-12">
        <LoadingModal open={!isCollectionLoaded} />
      </div>
      {isCollectionLoaded && collections.length === 0 && (
        <div className="mt-[30px] lg:mt-[35px]">
          <NoDataSection
            title="No collections were created"
            description="This tab displays the collections you have created on Foster Marketplace"
          />
        </div>
      )}
    </section>
  )
}

export default MyCollectionSection

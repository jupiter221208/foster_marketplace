import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// components
import DashboardCollectionCard from 'components/Card/DashboardCollectionCard'
import Pagination from 'components/Button/Pagination'
import LoadingModal from 'components/Modal/LoadingModal'

// styles
import styles from './index.module.scss'

// redux
import { useDispatch, useSelector } from 'react-redux'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyCollections } from 'utils/collection.util'
import NoDataSection from '../NoDataSection'

const MyCollectionSection = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  // const isLoading = useSelector<any>(state => state.isLoading)

  const [collections, setCollections] = useState([])
  const [collectionList, setCollectionList] = useState([])
  const [isCollectionLoaded, setIsCollectionLoaded] = useState(false)
  const { metaplex: mx } = useMetaplex()

  useEffect(() => {
    const getCollections = async () => {
      // dispatch({ type: 'set', isLoading: true })
      const collections = await getMyCollections(mx)
      let publicKey = mx.identity().publicKey
      setCollections(collections.filter(({ updateAuthorityAddress }) => updateAuthorityAddress?.equals(publicKey)))
      setIsCollectionLoaded(true)
      // dispatch({ type: 'set', isLoading: false })
    }
    if (mx) getCollections()
  }, [mx])

  const getCategory = attributes => {
    if (!Array.isArray(attributes)) return []
    return attributes.map(({ value }) => value).filter(category => !!category)
  }
  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-[11px] lg:gap-[32px] grid grid-cols-12">
        {isCollectionLoaded &&
          collectionList.map((item, index) => (
            <div className="col-span-6 lg:col-span-3" key={index}>
              <DashboardCollectionCard
                image={item.json?.image}
                nftName={item.json?.name}
                category={getCategory(item.json?.attributes)}
                artistAddress={item.creators[0]?.address.toString()}
                mintAddress={item.mintAddress.toBase58()}
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  router.push(`/collection/${item.mintAddress.toString()}`)
                }}
              />
            </div>
          ))}
      </div>
      <div className="col-span-12">
        <LoadingModal open={!isCollectionLoaded} />
      </div>
      {isCollectionLoaded && collectionList.length === 0 && (
        <div className="mt-[35px] lg:mt-[65px]">
          <NoDataSection
            title="No collections were created"
            description="This tab displays the collections you have created on Foster Marketplace"
          />
        </div>
      )}
      <div className="w-full flex justify-end">
        <Pagination data={collections} getCurrentData={data => setCollectionList(data)} />
      </div>
    </section>
  )
}

export default MyCollectionSection

import React, { useCallback, useEffect, useState } from 'react'

// redux
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// components
import OfferTable from 'components/Table/OfferTable'
import OfferAccordion from 'components/Accordion/OfferAccordion'
import Alert from 'components/Alert'
import LoadingModal from 'components/Modal/LoadingModal'

// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'
import { getPriceValue } from 'utils/strings'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyBids, getReceivedBids, cancelOffer, acceptOffer, LazyBidWithAsset } from 'utils/auction.util'

// call apis
import listingsAPI from 'apis/listings'
import NoDataSection from '../NoDataSection'
import usersAPI from 'apis/user'

// styles
import LoadingComponent from 'pages/explore/LoadingComponent'
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'
import LoadingElement from 'pages/profile/LoadingComponent/LoadingElement'

const OfferSection = props => {
  const { offerNftsMade, setOfferNftsMade, offerNftsReceived, setOfferNftsReceived } = props
  const viewport = useViewport()
  const { refreshToken } = useAuthentication()
  const router = useRouter()
  const { filter } = router.query

  const [shownOfferType, setShownOfferType] = useState<'made' | 'received'>('made')
  const [offersMade, setOffersMade] = useState<LazyBidWithAsset[] | null>(null)
  const [offersReceived, setOffersReceived] = useState<LazyBidWithAsset[] | null>(null)

  const [shownOfferList, setShownOfferList] = useState<LazyBidWithAsset[]>([])
  const [shownOfferListChunk, setShownOfferListChunk] = useState<LazyBidWithAsset[]>([])

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [offerLoaded, setOfferLoaded] = useState(false)

  const [rowCount, setRowCount] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  const [filterList, setFilterList] = useState([
    { id: 0, label: 'Offers Made', type: 'made' },
    { id: 1, label: 'Offers Received', type: 'received' },
  ])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: 'Offers Made', type: 'made' })

  const dispatch = useDispatch()

  const { metaplex: mx } = useMetaplex()

  const fetchOffersMade = useCallback(
    async (force: boolean = false) => {
      if (!mx || (offersMade && !force)) return
      let offers = await getMyBids(mx)
      setOffersMade(offers)
      setOfferNftsMade(offers)
    },
    [mx, offersMade]
  )

  const fetchOffersReceived = useCallback(
    async (force: boolean = false) => {
      if (!mx || (offersReceived && !force)) return
      let received = await getReceivedBids(mx)
      let received_reverse = received.reverse()
      setOffersReceived(received_reverse)
      setOfferNftsReceived(received_reverse)
    },
    [mx, offersReceived]
  )

  useEffect(() => {
    if (filter === '1') {
      setShownOfferType('received')
    }
  }, [filter])

  useEffect(() => {
    ;(async () => {
      setOfferLoaded(false)
      try {
        if (shownOfferType === 'made') {
          if (offerNftsMade.length > 0) {
            setOffersMade(offerNftsMade)
          } else await fetchOffersMade()
        } else if (shownOfferType === 'received') {
          if (offerNftsReceived.length > 0) {
            setOffersReceived(offerNftsReceived)
          } else await fetchOffersReceived()
        }
      } catch (e) {
        console.error(e)
      }
      setOfferLoaded(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownOfferType, fetchOffersMade, fetchOffersReceived])

  useEffect(() => {
    if (shownOfferType === 'made') setShownOfferList(offersMade ?? [])
    else if (shownOfferType === 'received') setShownOfferList(offersReceived ?? [])
  }, [shownOfferType, offersMade, offersReceived])

  useEffect(() => {
    setShownOfferListChunk(shownOfferList.slice(0, rowCount))
    if (shownOfferList.length > rowCount) setIsVisibleFetching(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownOfferList])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (shownOfferListChunk.length + rowCount > shownOfferList.length) {
        setShownOfferListChunk([
          ...shownOfferListChunk,
          ...shownOfferList.slice(shownOfferListChunk.length, shownOfferList.length),
        ])
        setIsVisibleFetching(false)
      } else {
        setShownOfferListChunk([
          ...shownOfferListChunk,
          ...shownOfferList.slice(shownOfferListChunk.length, shownOfferListChunk.length + rowCount),
        ])
        setIsVisibleFetching(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  const onCancel = async (listing: LazyBidWithAsset) => {
    await refreshToken()

    const { tradeStateAddress, asset } = listing
    const result = await cancelOffer(mx, tradeStateAddress)
    if (result) {
      listingsAPI.deleteOffer(asset.mintAddress.toBase58()).then(res => {
        if (res) {
          fetchOffersMade(true)
          setAlertData([
            {
              id: 0,
              title: 'Offer Canceled',
              description: `You've successfully canceled your offer on ${listing.asset.name}`,
              type: 'success',
            },
          ])
          setShowAlert(true)

          usersAPI.getLockupValues().then(
            response => {
              dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
              dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
            },
            error => {
              console.log(error)
            }
          )
        }
      })
    }
  }

  const onAccept = async (bid: LazyBidWithAsset) => {
    await refreshToken()

    const result = await acceptOffer(mx, bid)
    if (result) {
      setAlertData([
        {
          id: 0,
          title: 'Offer Accepted!',
          description: `You've successfully accepted an offer for ${bid.asset.name}`,
          type: 'success',
        },
      ])
      setShowAlert(true)

      setOfferLoaded(false)
      await fetchOffersReceived(true)
      setOfferLoaded(true)

      listingsAPI
        .acceptOffer(bid.asset.mintAddress.toBase58(), {
          buyer_wallet_id: bid.buyerAddress.toBase58(),
          amount: getPriceValue(bid.price.basisPoints.toNumber()),
        })
        .then(response => {
          usersAPI.getLockupValues().then(
            response => {
              dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
              dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
            },
            error => {
              console.log(error)
            }
          )
        }),
        error => {
          console.log(error)
        }
    } else {
      setAlertData([
        {
          id: 0,
          title: 'Offer Accept Failed!',
          description: `Failed to send the transaction, please check the validation for ${bid.asset.name}`,
          type: 'failure',
        },
      ])
      setShowAlert(true)
    }
  }

  return (
    <section className="w-full mt-[16px] lg:mt-[30px]">
      <div className="w-full flex z-10">
        <DropdownFilterMenu
          label={selectedItem['label']}
          data={filterList}
          selectedItem={selectedItem}
          setSelectedItem={item => {
            setSelectedItem(item)
            setShownOfferType(item.type)
          }}
        />
      </div>
      {!offerLoaded ? (
        <div className="col-span-12 mt-[70px]">
          <LoadingElement text="Loading offers" />
        </div>
      ) : shownOfferListChunk.length > 0 ? (
        <div className="w-full mt-[15px] lg:mt-[30px]">
          {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
            <OfferTable
              offerType={shownOfferType}
              data={shownOfferListChunk}
              onCancel={tradeStateAddress => onCancel(tradeStateAddress)}
              onAccept={onAccept}
            />
          ) : (
            <OfferAccordion
              offerType={shownOfferType}
              data={shownOfferListChunk}
              onCancel={tradeStateAddress => onCancel(tradeStateAddress)}
              onAccept={onAccept}
            />
          )}
        </div>
      ) : (
        <div className="mt-[35px] lg:mt-[60px]">
          <NoDataSection title="No results found" description="" />
        </div>
      )}

      {isVisibleFetching && (
        <div className="w-full mt-[100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} text="Loading offers" />
        </div>
      )}

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </section>
  )
}

export default OfferSection

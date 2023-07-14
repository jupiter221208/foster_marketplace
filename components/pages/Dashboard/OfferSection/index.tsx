import React, { useCallback, useEffect, useState } from 'react'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// components
import OfferTable from 'components/Table/OfferTable'
import OfferAccordion from 'components/Accordion/OfferAccordion'
import Pagination from 'components/Button/Pagination'
import Alert from 'components/Alert'
import LoadingModal from 'components/Modal/LoadingModal'
import FilterButton from 'components/Button/FilterButton'

// custom functions
import { useViewport } from 'utils'
import { getPriceValue } from 'utils/strings'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyBids, getReceivedBids, cancelOffer, acceptOffer, LazyBidWithAsset } from 'utils/auction.util'
import { useWallet } from '@solana/wallet-adapter-react'

// call apis
import listingsAPI from 'apis/listings'
import NoDataSection from '../NoDataSection'
import usersAPI from 'apis/user'
import { checkExpiryDate, getSignMessageVerbiage, loginWithSigned } from 'utils/auth'

const OfferSection = () => {
  const viewport = useViewport()
  const { publicKey, signMessage } = useWallet()
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

  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)

  const { metaplex: mx } = useMetaplex()

  const fetchOffersMade = useCallback(
    async (force: boolean = false) => {
      if (!mx || (offersMade && !force)) return
      setOffersMade(await getMyBids(mx))
    },
    [mx, offersMade]
  )

  const fetchOffersReceived = useCallback(
    async (force: boolean = false) => {
      if (!mx || (offersReceived && !force)) return
      let received = await getReceivedBids(mx)
      setOffersReceived(received.reverse())
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
      // dispatch({ type: 'set', isLoading: true })
      setOfferLoaded(false)
      try {
        if (shownOfferType === 'made') await fetchOffersMade()
        else if (shownOfferType === 'received') await fetchOffersReceived()
      } catch (e) {
        console.error(e)
      }
      dispatch({ type: 'set', isLoading: false })
      setOfferLoaded(true)
    })()
  }, [shownOfferType, fetchOffersMade, fetchOffersReceived])

  useEffect(() => {
    if (shownOfferType === 'made') setShownOfferList(offersMade ?? [])
    else if (shownOfferType === 'received') setShownOfferList(offersReceived ?? [])
  }, [shownOfferType, offersMade, offersReceived])

  const onCancel = async (listing: LazyBidWithAsset) => {
    if (!checkExpiryDate()) {
      let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
      await loginWithSigned(publicKey, signature, dispatch)
    }

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
    if (!checkExpiryDate()) {
      let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
      await loginWithSigned(publicKey, signature, dispatch)
    }

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
          console.log(response)
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
    <section className="w-full mt-6 lg:mt-12 z-10">
      <div className="flex">
        <FilterButton
          label="Offers Made"
          onClick={() => setShownOfferType('made')}
          selected={shownOfferType === 'made'}
        />
        <FilterButton
          label="Offers Received"
          onClick={() => setShownOfferType('received')}
          selected={shownOfferType === 'received'}
        />
      </div>
      {!offerLoaded ? (
        <div className="col-span-12 mt-10">
          <LoadingModal open={!offerLoaded} />
        </div>
      ) : shownOfferListChunk.length > 0 ? (
        <div className="w-full mt-[15px] lg:mt-[34px]">
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
        <div className="mt-[35px] lg:mt-[105px]">
          <NoDataSection
            title="You don't have any active offers right now"
            description="This tab shows any active offer you made or received on Foster Marketplace"
          />
        </div>
      )}

      <div className="w-full flex justify-end">
        <Pagination data={shownOfferList} getCurrentData={setShownOfferListChunk} />
      </div>

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

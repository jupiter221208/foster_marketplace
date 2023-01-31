import React, { useCallback, useEffect, useState } from 'react'

// redux
import { useDispatch, useSelector } from 'react-redux'

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
import { getMyBids, getReceivedBids, cancelOffer, acceptOffer, type LazyBidWithAsset } from 'utils/auction.util'

// call apis
import listingsAPI from 'apis/listings'
import NoDataSection from '../NoDataSection'

const OfferSection = () => {
  const viewport = useViewport()

  const [shownOfferType, setShownOfferType] = useState<'made' | 'received'>('made')
  const [offersMade, setOffersMade] = useState<LazyBidWithAsset[] | null>(null)
  const [offersReceived, setOffersReceived] = useState<LazyBidWithAsset[] | null>(null)

  const [shownOfferList, setShownOfferList] = useState<LazyBidWithAsset[]>([])
  const [shownOfferListChunk, setShownOfferListChunk] = useState<LazyBidWithAsset[]>([])

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

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
      setOffersReceived(await getReceivedBids(mx))
    },
    [mx, offersReceived]
  )

  useEffect(() => {
    (async () => {
      dispatch({ type: 'set', isLoading: true })
      try {
        if (shownOfferType === 'made') await fetchOffersMade()
        else if (shownOfferType === 'received') await fetchOffersReceived()
      } catch (e) {
        console.error(e)
      }
      dispatch({ type: 'set', isLoading: false })
    })()
  }, [shownOfferType, fetchOffersMade, fetchOffersReceived])

  useEffect(() => {
    if (shownOfferType === 'made') setShownOfferList(offersMade ?? [])
    else if (shownOfferType === 'received') setShownOfferList(offersReceived ?? [])
  }, [shownOfferType, offersMade, offersReceived])

  const onCancel = async ({ tradeStateAddress }: LazyBidWithAsset) => {
    const result = await cancelOffer(mx, tradeStateAddress)
    if (result) {
      fetchOffersMade(true)
      setAlertData([
        {
          id: 0,
          title: 'Success',
          description: `Your offer was successfully cancelled!`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    }
  }

  const onAccept = async (bid: LazyBidWithAsset) => {
    const result = await acceptOffer(mx, bid)
    if (result) {
      fetchOffersReceived(true)
      setAlertData([
        {
          id: 0,
          title: 'Success',
          description: `You've successfully accepted an offer!`,
          type: 'success',
        },
      ])
      listingsAPI
        .acceptOffer(bid.asset.mintAddress.toBase58(), {
          buyer_wallet_id: bid.buyerAddress.toBase58(),
          amount: getPriceValue(bid.price.basisPoints.toNumber()),
        })
        .then(response => {
          console.log(response)
        }),
        error => {
          console.log(error)
        }
      setShowAlert(true)
    }
  }

  return (
    <section className="w-full mt-6 lg:mt-12 z-10">
      <div className="flex">
        <FilterButton
          label="Offers Made"
          onClick={() => setShownOfferType('made')}
          color={shownOfferType === 'made' ? '#5AC3BA' : '#979EA2'}
          background={
            shownOfferType === 'made'
              ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))'
              : 'transparent'
          }
        />
        <FilterButton
          label="Offers Received"
          onClick={() => setShownOfferType('received')}
          color={shownOfferType === 'received' ? '#5AC3BA' : '#979EA2'}
          background={
            shownOfferType === 'received'
              ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))'
              : 'transparent'
          }
        />
      </div>
      {isLoading ? (
        <div className="col-span-12">
          <LoadingModal open={isLoading} />
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

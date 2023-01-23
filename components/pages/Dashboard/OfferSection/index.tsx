import React, { useEffect, useState } from 'react'

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

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyOffers, cancelOffer, acceptOffer } from 'utils/auction.util'

// call apis
import listingsAPI from 'apis/listings'
import NoDataSection from '../NoDataSection'

const OfferSection = () => {
  const viewport = useViewport()

  const [showOfferList, setShowOfferList] = useState<any[]>([])
  const [allList, setAllList] = useState<any[]>([])
  const [offerList, setOfferList] = useState<any[]>([])

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [active, setActive] = useState(0)

  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)

  const { metaplex: mx } = useMetaplex()

  const getOffers = async () => {
    dispatch({ type: 'set', isLoading: true })
    let offers = await getMyOffers(mx)
    setAllList(offers)
    dispatch({ type: 'set', isLoading: false })
    setIsLoaded(true)
  }

  useEffect(() => {
    if (allList.length === 0) return

    if (active === 0) {
      const new_list = allList.filter(item => item.isOutgoing === true)
      setOfferList(new_list)
    } else {
      const new_list = allList.filter(item => item.isOutgoing === false)
      setOfferList(new_list)
    }
  }, [allList, active])

  const onCancel = async tradeStateAddress => {
    const result = await cancelOffer(mx, tradeStateAddress)
    if (result) {
      getOffers()
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

  const onAccept = async (mintAddress, tradeStateAddress, listingTradeStateAddress, buyerAddress, price) => {
    const result = await acceptOffer(mx, tradeStateAddress, listingTradeStateAddress)
    if (result) {
      getOffers()
      setAlertData([
        {
          id: 0,
          title: 'Success',
          description: `You've successfully accepted an offer!`,
          type: 'success',
        },
      ])
      listingsAPI
        .acceptOffer(mintAddress, {
          buyer_wallet_id: buyerAddress,
          amount: price,
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

  const handleChangeActive = value => {
    setActive(value)
  }

  useEffect(() => {
    if (mx) getOffers()
  }, [mx])

  return (
    <section className="w-full mt-6 lg:mt-12 z-10">
      <div className="flex">
        <FilterButton
          label="Offers Made"
          onClick={() => handleChangeActive(0)}
          color={active === 0 ? '#5AC3BA' : '#979EA2'}
          background={
            active === 0 ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))' : 'transparent'
          }
        />
        <FilterButton
          label="Offers Received"
          onClick={() => handleChangeActive(1)}
          color={active === 1 ? '#5AC3BA' : '#979EA2'}
          background={
            active === 1 ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))' : 'transparent'
          }
        />
      </div>
      {isLoading ? (
        <div className="col-span-12">
          <LoadingModal open={isLoading} />
        </div>
      ) : (
        showOfferList.length > 0 && (
          <div className="w-full mt-[15px] lg:mt-[34px]">
            {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
              <OfferTable
                offerType={active === 0 ? 'Made' : 'Received'}
                data={showOfferList}
                onCancel={tradeStateAddress => onCancel(tradeStateAddress)}
                onAccept={(mintAddress, tradeStateAddress, listingTradeStateAddress, buyerAddress, price) =>
                  onAccept(mintAddress, tradeStateAddress, listingTradeStateAddress, buyerAddress, price)
                }
              />
            ) : (
              <OfferAccordion
                offerType={active === 0 ? 'Made' : 'Received'}
                data={showOfferList}
                onCancel={tradeStateAddress => onCancel(tradeStateAddress)}
                onAccept={(mintAddress, tradeStateAddress, listingTradeStateAddress, buyerAddress, price) =>
                  onAccept(mintAddress, tradeStateAddress, listingTradeStateAddress, buyerAddress, price)
                }
              />
            )}
          </div>
        )
      )}
      {isLoaded && showOfferList.length === 0 && (
        <div className="mt-[35px] lg:mt-[105px]">
          <NoDataSection
            title="You don't have any active offers right now"
            description="This tab shows any active offer you made or received on Foster Marketplace"
          />
        </div>
      )}

      <div className="w-full flex justify-end">
        <Pagination data={offerList} getCurrentData={data => setShowOfferList(data)} />
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

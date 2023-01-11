import React, { useEffect, useState } from 'react'

// redux
import { useDispatch, useSelector } from 'react-redux'

// components
import OfferTable from 'components/Table/OfferTable'
import OfferAccordion from 'components/Accordion/OfferAccordion'
import Pagination from 'components/Button/Pagination'
import Alert from 'components/Alert'
import LoadingModal from 'components/Modal/LoadingModal'

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
  const [offerList, setOfferList] = useState<any[]>([])

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(true)

  const updateDataAction = (index, action) => {
    let newList = [...offerList]
    newList[index].action = action
    switch (action) {
      case 'accept':
        setAlertData([
          {
            id: 0,
            title: 'Success',
            description: `You're offer was successfully cancelled!`,
            type: 'success',
            item: newList[index].name01,
            amount: newList[index].amount,
          },
        ])
        setShowAlert(true)
        break
      case 'cancel':
        setAlertData([
          {
            id: 0,
            title: 'Success',
            description: `You've successfully accepted an offer!`,
            type: 'success',
            item: newList[index].name01,
            amount: newList[index].amount,
          },
        ])
        setShowAlert(true)
        break
      default:
        break
    }
    setOfferList(newList)
  }

  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)

  const { metaplex: mx } = useMetaplex()

  const getOffers = async () => {
    dispatch({ type: 'set', isLoading: true })
    let offers = await getMyOffers(mx)
    setOfferList(offers)
    dispatch({ type: 'set', isLoading: false })
    setIsLoaded(true)
  }

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

  // useEffect(() => {
  //   if (mx) getOffers()
  // }, [mx])

  return (
    <section className="w-full mt-6 lg:mt-12 z-10">
      {isLoading ? (
        <div className="col-span-12">
          <LoadingModal open={isLoading} />
        </div>
      ) : (
        showOfferList.length > 0 && (
          <div className="w-full mt-[15px] lg:mt-[34px]">
            {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
              <OfferTable
                data={showOfferList}
                onCancel={tradeStateAddress => onCancel(tradeStateAddress)}
                onAccept={(mintAddress, tradeStateAddress, listingTradeStateAddress, buyerAddress, price) =>
                  onAccept(mintAddress, tradeStateAddress, listingTradeStateAddress, buyerAddress, price)
                }
              />
            ) : (
              <OfferAccordion
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
      {showOfferList.length > 0 && (
        <div className="w-full flex justify-end">
          <Pagination data={offerList} getCurrentData={data => setShowOfferList(data)} />
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

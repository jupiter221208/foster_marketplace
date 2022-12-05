import { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'

// custom components
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'
import LoadingButton from 'components/Button/LoadingButton'
import Alert from 'components/Alert'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import LiveAuctionImage from 'assets/images/live-auction.png'

// styles
import styles from './index.module.scss'

const ModalPlaceBid = props => {
  const { balance, nftName, nftUrl, placeBid, currentPrice, reservePrice, open, onClose, loading } = props
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [lowerPriceCheck, setLowerPriceCheck] = useState(false)
  const [balancePriceCheck, setBalancePriceCheck] = useState(false)

  const closeModal = () => {
    onClose()
  }

  const [price, setPrice] = useState(0)

  const onClickPlaceBid = async () => {
    placeBid(price)
  }

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Place Bid',
        description: `The bid amount you entered is lower than the starting bid or current bid.`,
        type: 'success',
      },
    ])
  }, [])

  useEffect(() => {
    if (price < reservePrice || price <= currentPrice) {
      setLowerPriceCheck(true)
      return
    } else {
      setLowerPriceCheck(false)
    }
    if (price > balance) {
      setBalancePriceCheck(true)
      return
    } else {
      setBalancePriceCheck(false)
    }
  }, [price])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.bgView} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={styles.modalView}>
                <div className={styles.close} onClick={closeModal}>
                  <Image src={CloseIcon} alt="" width={30} height={30} />
                </div>
                <div className={styles.title}>Place Bid</div>
                <div className="w-full mt-10">
                  <div className={styles.image}>
                    <img src={nftUrl} alt="" />
                  </div>
                </div>
                <div className={`${styles.nftName} mt-5`}>{nftName}</div>
                <div className="w-full mt-12">
                  <PriceInput
                    value={price}
                    placeholder="Enter price value"
                    fullWidth
                    onChange={value => setPrice(value)}
                  />
                </div>
                {price > 0 && (
                  <div className="w-full flex justify-center mt-1">
                    {lowerPriceCheck ? (
                      <div className={styles.errorText}>
                        The bid amount you entered is lower than the starting bid or current bid.
                      </div>
                    ) : balancePriceCheck ? (
                      <div className={styles.errorText}>
                        Insufficient available balance in bidding wallet and main wallet.
                        <br />
                        Please fund your wallet and try again .
                      </div>
                    ) : null}
                  </div>
                )}
                <div className="w-full mt-[30px]">
                  {loading ? (
                    <LoadingButton fullWidth />
                  ) : (
                    <GradientButton
                      disabled={price <= 0 || lowerPriceCheck || balancePriceCheck}
                      label="Place Bid"
                      fullWidth
                      onClick={onClickPlaceBid}
                    />
                  )}
                </div>
                <div className="w-full flex justify-center mt-10">
                  <div className={styles.text}>By selecting “Place bid” you agree to Terms of Services.</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        <Alert
          open={showAlert}
          close={() => {
            setShowAlert(false)
          }}
          data={alertData}
        />
      </Dialog>
    </Transition>
  )
}

export default ModalPlaceBid

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

// styles
import styles from './index.module.scss'

const ModalPlaceBid = props => {
  const { balance, nftName, nftUrl, placeBid, currentPrice, reservePrice, open, onClose, loading } = props
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [priceCheckMode, setPriceCheckMode] = useState(0)
  const [price, setPrice] = useState(0)

  const closeModal = () => {
    onClose()
  }

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
    if (open) {
      if (parseFloat(currentPrice) === 0) {
        setPrice(reservePrice)
      } else {
        let newPrice = (parseFloat(currentPrice) * 10 + 1) / 10
        setPrice(newPrice)
      }
    }
  }, [open])

  useEffect(() => {
    if (price == 0) {
      setPriceCheckMode(3)
      return
    }
    if (price < parseFloat(reservePrice) || price <= parseFloat(currentPrice)) {
      setPriceCheckMode(1)
      return
    } else {
      if (price > parseFloat(balance)) {
        setPriceCheckMode(2)
        return
      } else {
        setPriceCheckMode(0)
      }
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
                    placeholder="Enter bid amount"
                    fullWidth
                    onChange={value => setPrice(value)}
                  />
                </div>
                <div className="w-full mt-[30px]">
                  {loading ? (
                    <LoadingButton fullWidth />
                  ) : (
                    <GradientButton
                      disabled={priceCheckMode > 0}
                      label="Place Bid"
                      fullWidth
                      onClick={onClickPlaceBid}
                    />
                  )}
                </div>
                {price > 0 && (
                  <div className="w-full flex justify-center mt-10">
                    <div className={styles.text}>
                      {priceCheckMode === 3 ? (
                        <></>
                      ) : priceCheckMode === 1 ? (
                        <div className={styles.errorText}>
                          The bid amount you entered is lower than the starting bid or current bid.
                        </div>
                      ) : priceCheckMode === 2 ? (
                        <div className={styles.errorText}>
                          Insufficient available balance in bidding wallet and main wallet.
                          <br />
                          Please fund your wallet and try again.
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
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

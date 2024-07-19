import { Fragment, useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { useViewport } from 'utils'
import { Dialog, Transition } from '@headlessui/react'

// componenets

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// styles
import styles from './index.module.scss'
import MerchClaimShipping from 'components/pages/MerchOrder/MerchClaimShipping'
import MerchClaimShippingMethod from 'components/pages/MerchOrder/MerchClaimShippingMethod'
import MerchClaimCheckout from 'components/pages/MerchOrder/MerchClaimCheckout'

// API

const MerchClaimModal = ({ open, onClose, data }) => {
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [orderId, setOrderId] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState(null)

  const [totalCost, setTotalCost] = useState(0)
  const [printData, setPrintData] = useState(null)
  const [productDetail, setProductDetail] = useState(null)
  const [merchList, setMerchList] = useState([])
  const [rawUrlList, setRawUrlList] = useState([])
  const [merchSize, setMerchSize] = useState(null)
  const [type, setType] = useState('')

  useEffect(() => {
    if (!open || productDetail) return

    if (data) {
      setProductDetail(data)
      let imageList = [],
        rawList = []
      if (data.fulfillment_type === 'foster') {
        data.options.addons.map((item, index) => {
          imageList.push({ url: item.mockup_url, selected: index === 0 })
          rawList.push({ url: item.raw_url })
        })
        setType('foster')
      } else {
        data.options.addons.map((item, index) => {
          imageList.push({ url: item.mockup_url, selected: index === 0 })
        })
        if (data.master_edition_address === null) setType('physical')
        else setType('edition')
      }
      setMerchList(imageList)
      setRawUrlList(rawList)
      setPrintData({
        id: data.id,
        quantity: 1,
        size: 'L',
        color: data.options.color,
        name: data.name,
        description: data.description,
        technique: data.options.print_technique,
        cost: data.selling_price / 100,
      })
    }
  }, [open])

  useEffect(() => {
    if (merchSize) {
      setPrintData({ ...printData, size: merchSize })
    }
  }, [merchSize])

  const closeModal = () => {
    onClose()
  }

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

        <div className="fixed inset-0 w-full h-full">
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
              <div className={styles.childView}>
                {currentStep === 1 && (
                  <MerchClaimShipping
                    onClose={() => {
                      onClose()
                    }}
                    onNext={info => {
                      setShippingData(info.data)
                      setShippingMethod(info.method)
                      setCurrentStep(2)
                    }}
                    productId={productDetail?.product_type_id}
                    setMerchSize={setMerchSize}
                    data={shippingData}
                  />
                )}
                {currentStep === 2 && (
                  <MerchClaimShippingMethod
                    data={printData}
                    shippingData={shippingData}
                    allShippingMethod={shipppingMethod}
                    setTotalCost={setTotalCost}
                    merchList={merchList}
                    rawList={rawUrlList}
                    mintAddress={data.nft.token_id}
                    onNext={orderId => {
                      setOrderId(orderId)
                      setCurrentStep(3)
                    }}
                    onBack={() => {
                      setCurrentStep(1)
                    }}
                  />
                )}
                {currentStep === 3 && (
                  <MerchClaimCheckout
                    orderId={orderId}
                    onBack={() => {
                      setCurrentStep(2)
                    }}
                  />
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MerchClaimModal

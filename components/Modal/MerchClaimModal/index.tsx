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

const MerchClaimModal = ({ urls, open, onClose }) => {
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [orderId, setOrderId] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState(null)
  const [printData, setPrintData] = useState({
    id: 1,
    cost: '56.4',
    quantity: 1,
    size: 'L',
    color: 'white',
    name: 'product_name1',
    description: 'Unisex Premium Hoodie | Cotton Heritage M2580 | Embroidery | White',
  })
  const [totalCost, setTotalCost] = useState(0)

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
                    printData={printData}
                    data={shippingData}
                  />
                )}
                {currentStep === 2 && (
                  <MerchClaimShippingMethod
                    data={printData}
                    shippingData={shippingData}
                    allShippingMethod={shipppingMethod}
                    setTotalCost={setTotalCost}
                    merchList={urls}
                    mintAddress="0xE3f338g2dk3f82qdk333dee333dd33"
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

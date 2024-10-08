import React, { Fragment } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const PaymentDetailDropDown = props => {
  const { SSOrder, paymentDetails } = props
  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <Menu>
        <Menu.Button>
          <div className={`cursor-pointer ${styles.infoValue}`}>Payment&nbsp;Details</div>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={styles.menuArea}>
            <Menu.Item>
              <div>
                <div className={styles.name}>Payment Details</div>
                <div>
                  {SSOrder?.billTo && (
                    <div className={`mt-[6px] ${styles.detailValue}`}>Buyer:&nbsp;{SSOrder?.billTo?.name}</div>
                  )}
                  {SSOrder?.billTo && (
                    <div className={`mt-[6px] ${styles.detailValue}`}>
                      Buyer&nbsp;Email:&nbsp;
                      <span
                        className={styles.buyerEmail}
                        onClick={() => {
                          window.location.href = 'mailto:' + SSOrder?.customerEmail
                        }}
                      >
                        {SSOrder?.customerEmail}
                      </span>
                    </div>
                  )}
                  <div className={`mt-[6px] ${styles.detailValue}`}>
                    Payment&nbsp;Method:&nbsp;{paymentDetails?.method}
                  </div>
                  <div className={`mt-[6px] ${styles.detailValue}`}>
                    Payment&nbsp;Status:&nbsp;{paymentDetails?.txId?.length > 0 ? paymentDetails?.status : 'Pending'}
                  </div>

                  {/* {paymentDetails?.paidBy && (
                    <div className={`mt-[15px] ${styles.detailValue}`}>
                      Paid&nbsp;by:&nbsp;{getShortAddress(paymentDetails?.paidBy)}
                    </div>
                  )} */}
                  <div className={`mt-[6px] ${styles.detailValue}`}>
                    Shipping&nbsp;&&nbsp;Handling:&nbsp;${paymentDetails?.shipping}
                  </div>
                  <div className={`mt-[6px] ${styles.detailValue}`}>Tax:&nbsp;${paymentDetails?.tax}</div>
                  <div className={`mt-[20px] ${styles.viewTransaction}`}>View Transaction</div>
                </div>
              </div>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default PaymentDetailDropDown

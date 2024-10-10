import React, { Fragment } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const ShippingDetailDropDown = props => {
  const { tracking, shipping } = props
  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <Menu>
        <Menu.Button>
          <div className={`cursor-pointer ${styles.infoValue}`}>Shipping&nbsp;Details</div>
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
                <div className={styles.name}>Shipping Details</div>
                <div>
                  <div className={`mt-[6px] ${styles.detailValue}`}>Tracking&nbsp;#&nbsp;{tracking}</div>
                  <div className={`mt-[6px] ${styles.detailValue}`}>Shipping&nbsp;Carrier:&nbsp;{shipping}</div>

                  {/* {paymentDetails?.paidBy && (
                    <div className={`mt-[15px] ${styles.detailValue}`}>
                      Paid&nbsp;by:&nbsp;{getShortAddress(paymentDetails?.paidBy)}
                    </div>
                  )} */}
                </div>
              </div>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ShippingDetailDropDown

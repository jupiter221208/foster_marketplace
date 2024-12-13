import { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// components
import ProductionListMenu from 'components/Menu/ProductionListMenu'

// json
import FulfillType from 'assets/json/creator-merch/fulfill-type.json'
import DateRangeType from 'assets/json/creator-merch/daterange-type.json'
import OrderStatusType from 'assets/json/creator-merch/orderstatus-type.json'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// API

const MerchExportModal = ({ open, onClose }) => {
  const [fulfillType, setFulfillType] = useState(FulfillType[0])
  const [dateRangeType, setDateRangeType] = useState(DateRangeType[0])
  const [orderStatusType, setOrderStatusType] = useState(OrderStatusType[0])
  const [reportType, setReportType] = useState('csv')

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
                <div className={styles.exportOrders}>Export Orders</div>
                <div className={styles.fulfillType}>Fulfillment type</div>
                <div className="mt-[15px]">
                  <ProductionListMenu
                    width={546}
                    label={fulfillType.label}
                    data={FulfillType}
                    selectedItem={fulfillType}
                    setSelectedItem={item => {
                      setFulfillType(item)
                    }}
                  />
                </div>
                <div className={styles.fulfillType}>Date range</div>
                <div className="mt-[15px]">
                  <ProductionListMenu
                    width={546}
                    label={dateRangeType.label}
                    data={DateRangeType}
                    selectedItem={dateRangeType}
                    setSelectedItem={item => {
                      setDateRangeType(item)
                    }}
                  />
                </div>
                <div className={styles.fulfillType}>Order status</div>
                <div className="mt-[15px]">
                  <ProductionListMenu
                    width={546}
                    label={orderStatusType.label}
                    data={OrderStatusType}
                    selectedItem={orderStatusType}
                    setSelectedItem={item => {
                      setOrderStatusType(item)
                    }}
                  />
                </div>
                <div className={styles.fulfillType}>Report format</div>
                <div className="mt-[15px]">
                  <div className="flex gap-[30px]">
                    <div className="flex items-center gap-[15px]">
                      <input
                        className={styles.radio}
                        type="radio"
                        checked={reportType === 'csv'}
                        onChange={() => {
                          setReportType('csv')
                        }}
                      />
                      <div
                        className={styles.radioText}
                        onClick={() => {
                          setReportType('csv')
                        }}
                      >
                        CSV
                      </div>
                    </div>
                    <div className="flex items-center gap-[15px]">
                      <input
                        className={styles.radio}
                        type="radio"
                        checked={reportType === 'xlsx'}
                        onChange={() => {
                          setReportType('xlsx')
                        }}
                      />
                      <div
                        className={styles.radioText}
                        onClick={() => {
                          setReportType('xlsx')
                        }}
                      >
                        XLSX
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.divider} />
                <div className="w-full flex justify-end mt-[26px]">
                  <div className="flex gap-[16px]">
                    <OutlineButton
                      borderColor="transparent"
                      backgroundColor="rgba(var(--main-bg-color-rgb), 0.1)"
                      width={164}
                      height={50}
                      label="Cancel"
                      onClick={closeModal}
                    />
                    <GradientButton width={164} height={50} label="Download" />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MerchExportModal

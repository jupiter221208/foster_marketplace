import { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import * as XLSX from 'xlsx'

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
import StoreAPI from 'apis/store'

const MerchExportModal = ({ open, onClose }) => {
  const [fulfillType, setFulfillType] = useState(FulfillType[0])
  const [dateRangeType, setDateRangeType] = useState(DateRangeType[0])
  const [orderStatusType, setOrderStatusType] = useState(OrderStatusType[0])
  const [reportType, setReportType] = useState('csv')

  const data = [
    {
      Fulfillment: 'User fulfilled order',
      Order: '#foster/studio/mainnet/1420',
      Product: 'Cyberfrogs Hoodies',
      Status: 'Shipped',
      Total: '$41.37',
      Date: '3-Dec-24',
      Address: 'Tyler, 69 Dragon Ave, Solana Beach, CA 34761, US',
    },
    {
      Fulfillment: 'User fulfilled order',
      Order: '#foster/studio/mainnet/1690',
      Product: 'FF Tee',
      Status: 'New',
      Total: '$42.00',
      Date: '4-Dec-24',
      Address: 'Tyler, 69 Dragon Ave, Solana Beach, CA 34761, US',
    },
  ]

  const closeModal = () => {
    onClose()
  }

  const exportData = () => {
    StoreAPI.exportOrder('foster', null, null, null).then(response => {
      console.log(response, '==========response=========')
    })
    /*
    if (reportType === 'csv') {
      const csvRows = []
      const headers = Object.keys(data[0])
      csvRows.push(headers.join(',')) // Add header row

      for (const row of data) {
        csvRows.push(headers.map(field => JSON.stringify(row[field] || '')).join(','))
      }

      // Create a Blob from the CSV string
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'orders.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const worksheet = XLSX.utils.json_to_sheet(data)
      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      // Export the workbook to a file
      XLSX.writeFile(workbook, 'orders.xlsx')
    }*/
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
                    <GradientButton width={164} height={50} label="Download" onClick={() => exportData()} />
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

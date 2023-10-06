import { Fragment, useEffect, useMemo, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// custom components
import Input from 'components/Input'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'

// images
import AudioPlayerBackground from 'assets/images/audio-player.png'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'

// styles
import styles from './index.module.scss'

// backend
import AuctionsAPI from 'apis/auctions'

import SizeList from 'assets/json/print/size-chat-modal.json'
import SizeTitleList from 'assets/json/print/size-title.json'

// solana
import { startAuction } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { useDispatch } from 'react-redux'

const StartAuctionModal = props => {
  const { open, onSuccess, onClose, onStartProgress, title } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const { refreshToken } = useAuthentication()

  const closeModal = () => {
    setPrice(null)
    onClose()
  }

  const [startDate, setStartDate] = useState(new Date())
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('')
  const [price, setPrice] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const endDate = useMemo(() => {
    var plusDays = Number(days)
    var plusHours = Number(hours)

    if (days === '') plusDays = 0
    if (hours === '') plusHours = 0

    const endDate = new Date(startDate)
    endDate.setTime(startDate.getTime() + plusDays * 24 * 60 * 60 * 1000 + plusHours * 60 * 60 * 1000)

    return endDate
  }, [startDate, days, hours])

  const { metaplex: mx } = useMetaplex()

  const CustomTimeInput = ({ date, value, onChange }) => {
    return (
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: 'solid 1px rgba(#EFF0F6, 0.1)' }}
        className="!w-full h-full rounded-[9px] px-[10px] bg-transparent text-white flex-row-reverse"
      />
    )
  }

  useEffect(() => {
    let disabled = false

    if (parseFloat(days) > 30) disabled = true
    else if (days === '' && hours === '') disabled = true
    else if (parseFloat(hours) > 23) disabled = true
    else if (price === undefined || price === '' || price === null) disabled = true
    setButtonDisabled(disabled)
  }, [days, hours, price])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={closeModal}>
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
                <div className={styles.title}>{title} Size Chart</div>
                <div className={styles.close} onClick={closeModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                    <g id="Group_51239" data-name="Group 51239" transform="translate(-1164 -333)">
                      <rect
                        id="Rectangle_20877"
                        data-name="Rectangle 20877"
                        width="30"
                        height="30"
                        rx="15"
                        transform="translate(1164 333)"
                        fill="var(--modal-close-btn-bg)"
                      />
                      <path
                        id="times-7"
                        d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,1,0,1.42,1.42L12,13.41l4.29,4.3a1,1,0,1,0,1.42-1.42Z"
                        transform="translate(1167 335.999)"
                        fill="var(--text-gray-200-color)"
                      />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-col justity-center items-center pt-[30px] pb-[30px]">
                  <div className={styles.tableView}>
                    <div className="min-w-full">
                      <div className="overflow-hidden">
                        <table className="min-w-full text-center text-sm font-light">
                          <thead>
                            <tr className={styles.header}>
                              {SizeTitleList.map((item, index) => {
                                if (title === item.title)
                                  return item.fields.map((itemfield, index) => {
                                    return (
                                      <th key={index} className=" px-6 py-4">
                                        {itemfield}
                                      </th>
                                    )
                                  })
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {SizeList.map((item, index) => {
                              if (title === item.type) {
                                return item.size.map((sizeItem, index) => {
                                  switch (title) {
                                    case 'Short Sleeve':
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className=" px-6 py-4">{sizeItem.BrandSize}</th>
                                          <th className=" px-6 py-4">{sizeItem.USSize}</th>
                                          <th className=" px-6 py-4">{sizeItem.EUSize}</th>
                                          <th className=" px-6 py-4 min-w-[100px]">{sizeItem.Chest}</th>
                                        </tr>
                                      )

                                    case 'Sweatshirt':
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className="px-6 py-4">{sizeItem.BrandSize}</th>
                                          <th className="px-6 py-4">{sizeItem.Sleeve}</th>
                                          <th className="px-6 py-4">{sizeItem.Chest}</th>
                                          <th className="px-6 py-4">{sizeItem.Shoulder}</th>
                                        </tr>
                                      )

                                    case 'Hoodie':
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className="px-6 py-4">{sizeItem.BrandSize}</th>
                                          <th className="px-6 py-4">{sizeItem.SleeveLength}</th>
                                          <th>{sizeItem.Chest}</th>
                                        </tr>
                                      )

                                    case 'Youth Hoodie':
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className="px-6 py-4">{sizeItem.BrandSize}</th>
                                          <th className="px-6 py-4">{sizeItem.Chest}</th>
                                        </tr>
                                      )

                                    case 'Youth Short Sleeve':
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className="px-6 py-4">{sizeItem.BrandSize}</th>
                                          <th className="px-6 py-4">{sizeItem.USSize}</th>
                                          <th className="px-6 py-4">{sizeItem.EUSize}</th>
                                          <th className="px-6 py-4 min-w-[100px]">{sizeItem.Chest}</th>
                                        </tr>
                                      )

                                    case "Women's Short Sleeve":
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className="px-6 py-4">{sizeItem.BrandSize}</th>
                                          <th className="px-6 py-4">{sizeItem.USSize}</th>
                                          <th className="px-6 py-4 min-w-[100px]">{sizeItem.Chest}</th>
                                        </tr>
                                      )

                                    case 'Long Sleeve':
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className="px-6 py-4">{sizeItem.BrandSize}</th>
                                          <th className="px-6 py-4">{sizeItem.USSize}</th>
                                          <th className="px-6 py-4">{sizeItem.EUSize}</th>
                                          <th className="px-6 py-4 min-w-[100px]">{sizeItem.Chest}</th>
                                        </tr>
                                      )
                                  }
                                })
                              }
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default StartAuctionModal

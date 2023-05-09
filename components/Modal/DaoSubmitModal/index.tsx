import { Fragment, useState } from 'react'

// next component
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import NFTSortList from 'assets/json/explore/nft-sort.json'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Select from 'components/Select'
import SelectCategoryMenu from 'components/Menu/SelectCategoryMenu'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg'

const DaoSubmitModal = props => {
  const { data, open, onSubmit, onClose } = props
  const viewport = useViewport()
  const [startDate, setStartDate] = useState(new Date())
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [price, setPrice] = useState()
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const [selectedCategoryName, setSelectedCategoryName] = useState(null)
  const categoryList = [
    { id: '1', name: 'Category1' },
    { id: '2', name: 'Category2' },
  ]
  const closeModal = () => {
    onClose()
  }

  const chooseCategory = index => {
    if (index >= 0) {
      setSelectedCategoryName(categoryList[index].name)
    } else {
      setSelectedCategoryName(null)
    }
  }

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
                <div className="w-[50%]">
                  <div className={styles.title}>DAO Proposal Submission</div>
                  <div className="mt-[22px]">
                    <div className={styles.text}>Category</div>
                    <div className="w-full mt-[12px]">
                      <SelectCategoryMenu
                        categories={categoryList}
                        name={selectedCategoryName}
                        onClick={index => chooseCategory(index)}
                      />
                    </div>
                  </div>
                  <div className="mt-[22px]">
                    <div className={styles.text}>Proposal Title</div>
                    <div className="mt-[12px]">
                      <Input
                        value=""
                        placeholder="Give your art name"
                        label=""
                        fullWidth
                        onChange={() => {}}
                        height="46px"
                      />
                    </div>
                  </div>
                  <div className="mt-[22px]">
                    <div className={styles.text}>Overview</div>
                    <div className="mt-[12px]">
                      <Textarea
                        value=""
                        placeholder="Provide a detailed explanation of the proposal and how it will be executed, including 
                        to whom each necessary step is delegated."
                        fullWidth
                        onChange={() => {}}
                        height="90px"
                      />
                    </div>
                  </div>
                  <div className="mt-[22px]">
                    <div className={styles.text}>Goals/Evaluation Metrics</div>
                    <div className="mt-[12px]">
                      <Textarea
                        value=""
                        placeholder="How will this proposal produce benefits to CircusDAO?&#10;
                        How does this initiative reflect the values of CircusDAO in its support of Foster Marketplace, 
                        Solana, and the integrity of artists?&#10;
                        
                        What kind of qualitative and quantitative data can we analyze to determine its success?"
                        fullWidth
                        onChange={() => {}}
                        height={172}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-[50%] relative">
                  <div className="mt-[96px]">
                    <div className={styles.text}>Treasury Spending Required</div>
                    <div className="mt-[12px]">
                      <Input
                        value=""
                        placeholder="Estimated funds required to implement proposal"
                        label=""
                        fullWidth
                        onChange={() => {}}
                        height="46px"
                      />
                    </div>
                  </div>
                  <div className="mt-[38px]">
                    <div className={styles.text}>Timeline/Roadmap</div>
                    <div className="mt-[12px]">
                      <Textarea
                        value=""
                        placeholder="Produce a stringent timeline as to the beginning, development, and deployment of with an 
                        emphasis on any deadlines and time constraints."
                        fullWidth
                        onChange={() => {}}
                        height="90px"
                      />
                    </div>
                  </div>
                  <div className="flex mt-[40px] gap-[30px]">
                    <div className="w-[60%]">
                      <div className={styles.text}>Voting Start Time</div>
                      <div className="mt-[13px] w-full startAuctionDatePicker">
                        <div className="relative">
                          <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                            minDate={moment().toDate()}
                            showTimeInput
                            timeInputLabel=""
                            className={styles.datePicker}
                            customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                          />
                          <div className="absolute top-[8px] right-4">
                            <Image src={ArrowDownIcon} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-[40%]">
                      <div className={styles.text}>Voting Duration</div>
                      <div className="flex gap-[10px] mt-[13px]">
                        <div className="flex gap-[5px] items-center">
                          <Input
                            placeholder="0"
                            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                            fullWidth
                            backgroundColor={'var(--auction-input-bg)'}
                            color="#eff0f6"
                            borderRadius={9}
                            type="number"
                            onChange={value => {
                              setButtonDisabled(value < 0 || value > 30 || price === undefined)
                              setDays(value)
                            }}
                          />
                          <div className={styles.placeholder}>Days</div>
                        </div>
                        <div className="flex gap-[5px] items-center">
                          <Input
                            placeholder="0"
                            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                            fullWidth
                            backgroundColor={'var(--auction-input-bg)'}
                            color="#eff0f6"
                            borderRadius="9px"
                            type="number"
                            onChange={value => setHours(value)}
                          />
                          <div className={styles.placeholder}>Hours</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-0">
                    <div className="flex gap-[24px]">
                      <OutlineButton
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 125 : 173}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 57}
                        fontSize={22}
                        label="Cancel"
                        onClick={onClose}
                      />
                      <GradientButton
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 125 : 173}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 57}
                        fontSize={22}
                        gradientDirection="bottom"
                        label="Submit"
                        onClick={onSubmit}
                      />
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

export default DaoSubmitModal

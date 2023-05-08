import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

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

const DaoSubmitModal = props => {
  const { data, open, onSubmit, onClose } = props
  const viewport = useViewport()

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
                <div className="w-[50%]"></div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DaoSubmitModal

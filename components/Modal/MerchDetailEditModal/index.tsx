import { Fragment, useState } from 'react'
import { useViewport } from 'utils'

// components

// third party components
import { Dialog, Transition } from '@headlessui/react'
import { limit } from 'utils/strings'
// resources

// styles
import styles from './index.module.scss'

// json

import ImageWithFoster from 'components/ImageWithFoster'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'

// api
import StoreAPI from 'apis/store'
import LoadingButton from 'components/Button/LoadingButton'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

const MerchDetailEditModal = ({ userId, productId, data, merchImage, open, onClose, onSuccess }) => {
  const viewport = useViewport()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(data.name)
  const [description, setDescription] = useState(data.description)

  const closeModal = () => {
    onClose()
  }

  const save = () => {
    setIsLoading(true)
    StoreAPI.updateStoreById(userId, productId, {
      name,
      description,
    }).then(response => {
      setIsLoading(false)
      onSuccess({ name, description })
    }),
      error => {
        setIsLoading(false)
        console.log(error)
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
              <div className={styles.mainView}>
                {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
                  <div className="">
                    <div className={styles.backUpdate} onClick={closeModal}>
                      <ArrowLeftIcon />
                      Edit Product
                    </div>
                    <div className="w-[390px] h-[390px] mt-[34px]">
                      <ImageWithFoster
                        src={merchImage?.url}
                        width={390}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full mt-[30px] g-container">
                    <div className="w-full flex justify-center">
                      <div className="w-[343px] h-[343px] mt-[25px]">
                        <ImageWithFoster
                          src={merchImage?.url}
                          width={390}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${styles.mobileBG} relative w-full g-container lg:px-0 lg:flex-1`}>
                  <div className="w-full mt-[30px] lg:mt-[20px]">
                    <div className={styles.title}>Product Name</div>
                    <div className="mt-[15px] w-full">
                      <Input
                        value={limit(name, 42)}
                        placeholder="Give your product name"
                        label=""
                        fullWidth
                        backgroundColor="rgba(var(--main-bg-color-rgb), 0.05)"
                        borderColor="transparent"
                        onChange={value => setName(limit(value, 42))}
                        height="50px"
                      />
                    </div>
                  </div>
                  <div className="w-full mt-[30px] lg:mt-[45px]">
                    <div className={styles.title}>Product Description</div>

                    <div className="w-full mt-[15px]">
                      <Textarea
                        height={140}
                        value={limit(description, 1000)}
                        fontFamily="Muli-Light"
                        backgroundColor="rgba(var(--main-bg-color-rgb), 0.05)"
                        borderColor="rgba(var(--main-bg-color-rgb), 0.05)"
                        placeholder="Add a short description"
                        label01="Max Characters 1000"
                        label02={
                          1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`
                        }
                        onChange={value => setDescription(limit(value, 1000))}
                      />
                    </div>
                  </div>
                  <div className={`lg:hidden block pb-[50px]`}>
                    <div className="w-full mt-[30px] mb-[50px]">
                      {isLoading ? (
                        <LoadingButton fullWidth height={45} />
                      ) : (
                        <GradientButton fullWidth label="Save" height={45} onClick={() => save()} />
                      )}
                    </div>
                  </div>
                  <div className={`absolute bottom-0 right-0 lg:block hidden mt-[30px]`}>
                    <div className="flex gap-[30px]">
                      <div>
                        <OutlineButton width={100} label="Cancel" height={45} onClick={closeModal} />
                      </div>
                      <div>
                        {isLoading ? (
                          <LoadingButton width={100} height={45} />
                        ) : (
                          <GradientButton width={100} label="Save" height={45} onClick={() => save()} />
                        )}
                      </div>
                    </div>
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

export default MerchDetailEditModal

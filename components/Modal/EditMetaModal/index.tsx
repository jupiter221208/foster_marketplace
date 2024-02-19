import React, { useState, Fragment } from 'react'
import { useRouter } from 'next/router'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Input from 'components/Input'

// custom components
import { limit } from 'utils/strings'
import Textarea from 'components/Input/Textarea'

// resources
import EditImageIcon from 'assets/icons/edit-icon.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import WalletInputBox from 'components/Input/WalletInputBox'
import AttributeInputBox from 'components/Input/AttributetInputBox'

// apis

const EditMetaModal = props => {
  const { open, close, data, nftCover, nftInfo } = props
  const router = useRouter()
  const [artName, setArtName] = useState(nftInfo.name)
  const [artDesc, setArtDesc] = useState(nftInfo.description)
  const [creatorList, setCreatorList] = useState([{ address: nftInfo.creator_address, share: '100' }])
  const [attributeList, setAttributeList] = useState([{ type: '', name: '' }])

  const closeModal = () => {
    close()
  }

  return (
    <div>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className={styles.container} onClose={() => closeModal()}>
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
            <div className="flex min-h-full items-center justify-center text-center">
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
                  {/* Desktop */}
                  <div className="hidden lg:block">
                    <div className="w-full flex gap-[40px]">
                      <div className={styles.artImage}>
                        <img src={nftCover} alt="" className="w-full h-full object-cover" />
                        <div className="absolute w-[40px] h-[40px] right-[28px] bottom-[24px]">
                          <EditImageIcon alt="" />
                        </div>
                      </div>
                      <div className="w-full">
                        <div className={styles.artName}>Artwork Name</div>
                        <div className="w-full mt-[15px]">
                          <Input
                            value={limit(artName, 32)}
                            placeholder="Give your art name"
                            label01="Max Characters 32"
                            label02={32 - artName.length === 32 ? '' : `${32 - artName.length} Characters left`}
                            onChange={value => setArtName(limit(value, 32))}
                          />
                        </div>
                        <div className={`${styles.artName} mt-[40px]`}>Artwork Description</div>
                        <div className="w-full mt-[15px]">
                          <Textarea
                            value={limit(artDesc, 1000)}
                            placeholder="Give your art name"
                            label01="Max Characters 1000"
                            label02={1000 - artDesc.length === 1000 ? '' : `${1000 - artDesc.length} Characters left`}
                            onChange={value => setArtDesc(limit(value, 1000))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex mt-[44px] justify-between">
                      <div className="w-[50%]">
                        <WalletInputBox
                          creatorList={creatorList}
                          setCreatorList={setCreatorList}
                          label="Creator Royalties"
                        />
                      </div>
                      <div className="w-[45%]">
                        <AttributeInputBox
                          attributeList={attributeList}
                          setAttributeList={setAttributeList}
                          label="Attributes"
                        />
                      </div>
                    </div>

                    <div className="w-full flex justify-end mt-[80px]">
                      <div className="flex gap-[30px]">
                        <OutlineButton
                          width={100}
                          label="Canel"
                          onClick={() => close()}
                          borderWidth={2}
                          borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                        />
                        <GradientButton
                          width={100}
                          backgroundColor01="var(--main-icon-color)"
                          backgroundColor02="var(--main-icon-color)"
                          label="Save"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className="block lg:hidden g-container">
                    <div className={`${styles.artImage} mt-[56px]`}>
                      <img src={nftCover} alt="" className="w-full h-full object-cover" />
                      <div className="absolute w-[30px] h-[30px] right-[17px] bottom-[19px]">
                        <EditImageIcon alt="" />
                      </div>
                    </div>
                    <div className="w-full mt-[30px]">
                      <div className={styles.artName}>Artwork Name</div>
                      <div className="w-full mt-[15px]">
                        <Input
                          height={47}
                          value={limit(artName, 32)}
                          placeholder="Give your art name"
                          label01="Max Characters 32"
                          label02={32 - artName.length === 32 ? '' : `${32 - artName.length} Characters left`}
                          onChange={value => setArtName(limit(value, 32))}
                        />
                      </div>
                      <div className={`${styles.artName} mt-[30px]`}>Artwork Description</div>
                      <div className="w-full mt-[15px]">
                        <Textarea
                          height={140}
                          value={limit(artDesc, 1000)}
                          placeholder="Give your art name"
                          label01="Max Characters 1000"
                          label02={1000 - artDesc.length === 1000 ? '' : `${1000 - artDesc.length} Characters left`}
                          onChange={value => setArtName(limit(value, 1000))}
                        />
                      </div>
                    </div>
                    <div className="w-full mt-[40px]">
                      <div className="w-full">
                        <AttributeInputBox
                          attributeList={attributeList}
                          setAttributeList={setAttributeList}
                          label="Attributes"
                        />
                      </div>
                      <div className="w-full mt-[30px]">
                        <WalletInputBox
                          creatorList={creatorList}
                          setCreatorList={setCreatorList}
                          label="Creator Royalties"
                        />
                      </div>

                      <div className="flex gap-[24px] mt-[70px] mb-[70px]">
                        <OutlineButton
                          fullWidth
                          height={45}
                          label="Canel"
                          onClick={() => close()}
                          borderWidth={2}
                          borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                        />
                        <GradientButton
                          fullWidth
                          height={45}
                          backgroundColor01="var(--main-icon-color)"
                          backgroundColor02="var(--main-icon-color)"
                          label="Save"
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
    </div>
  )
}

export default EditMetaModal

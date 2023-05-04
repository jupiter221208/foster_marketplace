import React, { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// foster component
import CategoryChip from 'components/Chip/CategoryChip'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const ReadMoreModal = props => {
  const { open, close, artistInfo, categoryList, stats } = props

  const router = useRouter()

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
                  <div className={styles.close} onClick={() => closeModal()}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  <div className="w-full h-full overflow-auto">
                    <div className="w-full max-h-[calc(100vh_-_200px)] pl-1 pr-1 pt-1">
                      <div className="w-full mt-[30px]">
                        <div className={styles.profile}>DESCRIPTION</div>
                        <div className={styles.description}>{artistInfo.description}</div>
                      </div>

                      <div className="flex justify-center mt-[30px] mb-[30px]">
                        <div className={`${styles.nftInfo} grid grid-cols-12`}>
                          <>
                            <div className="col-span-2 flex justify-start items-center">
                              <div className="text-center">
                                <div className={styles.nftInfoLabel}>ITEMS</div>
                                <div className={styles.nftInfoValue}>{stats.items}</div>
                              </div>
                            </div>
                            <div className="col-span-2 flex justify-center items-center">
                              <div className="text-center">
                                <div className={styles.nftInfoLabel}>OWNERS</div>
                                <div className={styles.nftInfoValue}>{stats.owners}</div>
                              </div>
                            </div>
                            <div className="col-span-4 flex justify-center items-center">
                              <div className="text-center">
                                <div className={styles.nftInfoLabel}>FLOOR PRICE</div>
                                <div className="flex items-center justify-center">
                                  <div className={`${styles.nftInfoValue} ml-[8px]`}>
                                    {stats.floorPrice > 0 ? stats.floorPrice : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-4 flex justify-center items-center">
                              <div className="text-center">
                                <div className={styles.nftInfoLabel}>TOTAL VOLUME</div>

                                <div className="flex items-center justify-center">
                                  {stats.totalVolume > 0 ? <Image src={SolanaLogoIcon} alt="" /> : <></>}
                                  <div className={`${styles.nftInfoValue} ml-[8px]`}>
                                    {stats.totalVolume > 0 ? stats.totalVolume : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        </div>
                      </div>

                      <div className="w-full mt-[30px] lg:mt-[50px]">
                        <div className={styles.category}>CATEGORIES</div>
                        <div className="flex justify-start mt-[20px] mb-[10px]">
                          <div className={styles.categoryList}>
                            {categoryList.map((item, index) => (
                              <div key={index}>{item.length > 0 && <CategoryChip data={{ value: item }} />}</div>
                            ))}
                          </div>
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
    </div>
  )
}

export default ReadMoreModal

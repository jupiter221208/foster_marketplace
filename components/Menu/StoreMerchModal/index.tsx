import { Fragment } from 'react'
import { useRouter } from 'next/router'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const StoreMerchModal = props => {
  const { open, close, item, onBuyNow, showTimer, timeLeft } = props

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={close}>
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

        <div className="fixed inset-0 lg:flex lg:justify-center lg:items-center">
          <div className={styles.modalView}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full">
                <div className={styles.topSection}>
                  <div className="w-[41px] h-[41px]">
                    <img
                      src={
                        item.fulfillment_type === 'foster'
                          ? item.options.addons[0].mockup_url
                          : item.options.product_images[0]
                      }
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className={styles.storeName}>{item.name}</div>
                    <div className={styles.storeDesc}>{item.description.split('|')[0]}</div>
                  </div>
                </div>
                <div className="w-full px-[31px] mt-[15px] mb-[40px]">
                  <div className="w-full flex justify-between">
                    <div className={styles.label}>Price</div>
                    <div>${item.selling_price / 100}</div>
                  </div>
                  <div className="w-full flex justify-between mt-[9px]">
                    <div className={styles.label}>{item.supply ? 'Limited Supply' : 'Open Supply'}</div>
                    <div>
                      {item.supply ? `${item.current_supply}/${item.supply} left` : `${item.current_supply} sold`}
                    </div>
                  </div>
                  {showTimer && (
                    <div className="w-full flex justify-between mt-[9px]">
                      <div className={styles.label}>Ends in</div>
                      <div>
                        <div className="flex gap-[4px] mt-[7px]">
                          {timeLeft && timeLeft['days'] !== '00' && (
                            <div className="flex block justify-center gap-[1px]">
                              <div className={styles.time}>{timeLeft['days']}</div>
                              <div className={styles.time}>d</div>
                            </div>
                          )}
                          {timeLeft && timeLeft['hours'] !== '00' && (
                            <div className="flex block justify-center gap-[1px]">
                              <div className={styles.time}>{timeLeft['hours']}</div>
                              <div className={styles.time}>h</div>
                            </div>
                          )}
                          {timeLeft && timeLeft['minutes'] !== '00' && (
                            <div className="flex block justify-center gap-[1px]">
                              <div className={styles.time}>{timeLeft && timeLeft['minutes']}</div>
                              <div className={styles.time}>m</div>
                            </div>
                          )}
                          {timeLeft && timeLeft['seconds'] !== '00' && (
                            <div className="flex block justify-center gap-[1px]">
                              <div className={styles.time}>{timeLeft && timeLeft['seconds']}</div>
                              <div className={styles.time}>s</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="w-full mt-[15px]">
                    <GradientButton
                      label="Buy Now"
                      fullWidth
                      height={43}
                      onClick={onBuyNow}
                      borderRadius={10}
                      fontSize={16}
                    />
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

export default StoreMerchModal

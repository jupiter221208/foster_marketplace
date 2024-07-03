import { Fragment, useEffect, useState } from 'react'

// next components

// third party components
import { Dialog, Transition } from '@headlessui/react'

// componenets

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const MerchEditionViewModal = ({ urls, open, onClose }) => {
  const [assetUrls, setAssetUrls] = useState([])
  const [selectedAsset, setSelectedAsset] = useState(urls[0])

  const closeModal = () => {
    onClose()
  }

  useEffect(() => {
    let asset_urls = []
    urls.map((asset, index) => {
      if (index === 0) asset_urls.push({ id: index, url: asset, selected: true })
      else asset_urls.push({ id: index, url: asset, selected: false })
    })
    setAssetUrls(asset_urls)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectAssetItem = item => {
    let urls = []
    assetUrls.map(asset => {
      if (asset.id === item.id) {
        urls.push({ id: asset.id, url: asset.url, selected: true })
      } else {
        urls.push({ id: asset.id, url: asset.url, selected: false })
      }
    })
    setAssetUrls(urls)
    setSelectedAsset(item.url)
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
              <div className={styles.close} onClick={closeModal}>
                <CloseIcon alt="" />
              </div>
              <div className="mt-[100px]">
                <div className="w-full flex justify-center">
                  <div className="w-[375px] h-[375px] sm:w-[600px] sm:h-[600px]">
                    <ImageWithFoster src={selectedAsset} width={600} className="w-full h-full" />
                  </div>
                </div>
                <div className="w-full flex justify-center mt-[30px]">
                  <div className="flex gap-[9px] lg:gap-[30px]">
                    {assetUrls.map((item, index) => (
                      <div
                        key={index}
                        className={item.selected ? styles.selected : styles.unselected}
                        onClick={() => selectAssetItem(item)}
                      >
                        <ImageWithFoster src={item.url} width={130} className="w-full h-full" />
                      </div>
                    ))}
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

export default MerchEditionViewModal

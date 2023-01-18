import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// third party components
import { useDispatch } from 'react-redux'

// next components
import Image from 'next/image'

// custom components
import PriceInput from 'components/Input/PriceInput'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import AudioPlayerBackground from 'assets/images/audio-player.png'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

// solana
import { listNFT } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'

// call apis
import listingsAPI from 'apis/listings'

const ListNFTModal = props => {
  const { data, open, onClose } = props
  const dispatch = useDispatch()
  const [price, setPrice] = useState<number>()
  const [listStatus, setListStatus] = useState(false)
  const { metaplex: mx } = useMetaplex()

  const handleListNFTClick = async () => {
    const result: any = await listNFT(mx, data.mintAddress, price)
    if (result) {
      listingsAPI.listNft(data.mintAddress.toString(), { amount: price }).then(response => {
        console.log(response)
      }),
        error => {
          console.log(error)
        }
      dispatch({ type: 'set', isGetListedNFTs: false })
      setListStatus(true)
    }
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => onClose('unlisted')}>
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
              {!listStatus ? (
                <Dialog.Panel className={styles.modalView}>
                  <div className={styles.close} onClick={() => onClose('unlisted')}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  <div className={styles.title}>List NFT</div>
                  <div className="w-full max-w-[321px] mt-[20px] lg:mt-10 flex justify-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                    {data?.offchainMetadata.category === 'video' ||
                    data?.offchainMetadata.properties?.category === 'video' ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data?.offchainMetadata.animation_url} type="video/mp4" /></video>`,
                        }}
                      />
                    ) : (
                      <img
                        src={
                          data?.offchainMetadata.image === undefined || data?.offchainMetadata.image === null
                            ? AudioPlayerBackground.src
                            : data?.offchainMetadata.image
                        }
                        alt={data?.offchainMetadata.name || data?.name}
                        className="w-full aspect-[321/321] object-cover"
                      />
                    )}
                  </div>
                  <div className={`${styles.nftName} mt-[10px] lg:mt-5 w-full`}>
                    {data?.offchainMetadata.name || data?.name}
                  </div>
                  <div className="w-full mt-[20px] lg:mt-12">
                    <PriceInput
                      value={price}
                      placeholder="Enter fixed-price for listing"
                      fullWidth
                      onChange={value => setPrice(value)}
                    />
                  </div>
                  <div className="w-full mt-[15px] lg:mt-[30px]">
                    <GradientButton
                      disabled={price !== undefined && price > 0 ? false : true}
                      label="List"
                      color="#95DBD5"
                      fontSize={18}
                      fullWidth
                      backgroundColor01="#121212"
                      backgroundColor02="#2D625D"
                      gradientDirection="right"
                      onClick={() => handleListNFTClick()}
                    />
                  </div>
                  <div className="w-full mt-[20px] lg:mt-[30px]">
                    <p className={styles.bottomText}>
                      By clicking &quot;List&quot;, you agree to the&nbsp;
                      <span
                        className={styles.bottomLink}
                        onClick={() => {
                          window.open('https://foster-marketplace.gitbook.io/docs/v/legal-documentation/')
                        }}
                      >
                        Foster Marketplace Terms of Service
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className={styles.modalView}>
                  <div className={styles.close} onClick={() => onClose('unlisted')}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  {data?.offchainMetadata.category === 'video' ||
                  data?.offchainMetadata.properties?.category === 'video' ? (
                    <div
                      className="mt-[20px]"
                      dangerouslySetInnerHTML={{
                        __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data?.offchainMetadata?.animation_url} type="video/mp4" /></video>`,
                      }}
                    />
                  ) : (
                    <img
                      src={
                        data?.offchainMetadata?.image === undefined || data?.offchainMetadata?.image === null
                          ? AudioPlayerBackground.src
                          : data?.offchainMetadata?.image
                      }
                      alt={data?.offchainMetadata.name || data?.name}
                      className="w-full aspect-[321/321] object-cover mt-[20px]"
                    />
                  )}
                  <div className="mt-5">
                    <div className={styles.title}>NFT has been listed!</div>
                  </div>
                  <div className="w-full mt-[30px]">
                    <GradientButton
                      label="View Listing"
                      fullWidth
                      onClick={() => {
                        setListStatus(false)
                        onClose('listed')
                      }}
                    />
                  </div>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ListNFTModal

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
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { listNFT } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { useWallet } from '@solana/wallet-adapter-react'

// call apis
import listingsAPI from 'apis/listings'
import LoadingButton from 'components/Button/LoadingButton'
import { checkExpiryDate, getSignMessageVerbiage, loginWithSigned } from 'utils/auth'

const ListNFTModal = props => {
  const { data, open, onClose } = props
  const dispatch = useDispatch()
  const [price, setPrice] = useState<string>()
  const [listStatus, setListStatus] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const { metaplex: mx } = useMetaplex()
  const { publicKey, signMessage } = useWallet()

  const handleListNFTClick = async () => {
    setShowLoading(true)

    if (!checkExpiryDate()) {
      let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
      await loginWithSigned(publicKey, signature, dispatch)
    }

    const result: any = await listNFT(mx, data.mintAddress, parseFloat(price) * LAMPORTS_PER_SOL)
    if (result) {
      listingsAPI.listNft(data.mintAddress.toString(), { amount: price }).then(response => {}),
        error => {
          console.log(error)
        }
      dispatch({ type: 'set', isGetListedNFTs: false })
      setListStatus(true)
      setShowLoading(false)
    } else {
      setShowLoading(false)
    }
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={styles.container}
        onClose={() => {
          setListStatus(false)
          setShowLoading(false)
          setPrice(null)
          onClose('unlisted')
        }}
      >
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
                  <div
                    className={styles.close}
                    onClick={() => {
                      setListStatus(false)
                      setShowLoading(false)
                      setPrice(null)
                      onClose('unlisted')
                    }}
                  >
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
                  <div className={styles.title}>List NFT</div>
                  <div className="w-full max-w-[321px] mt-[20px] lg:mt-10 flex justify-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                    {data?.json?.category === 'video' || data?.json?.properties?.category === 'video' ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data?.json?.animation_url} type="video/mp4" /></video>`,
                        }}
                      />
                    ) : (
                      <img
                        src={data?.json?.image || AudioPlayerBackground.src}
                        alt={data?.json?.name || data?.name}
                        className="w-full aspect-[321/321] object-cover"
                      />
                    )}
                  </div>
                  <div className={`${styles.nftName} mt-[10px] lg:mt-5 w-full`}>{data?.json?.name || data?.name}</div>
                  <div className="w-full mt-[20px] lg:mt-12">
                    <PriceInput
                      value={price}
                      placeholder="Enter fixed-price for listing"
                      backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                      fullWidth
                      onChange={value => setPrice(value)}
                    />
                  </div>
                  <div className="w-full mt-[15px] lg:mt-[30px]">
                    {showLoading ? (
                      <LoadingButton fullWidth />
                    ) : (
                      <GradientButton
                        disabled={parseFloat(price ?? '0') <= 0}
                        label="List"
                        fontSize={18}
                        fullWidth
                        onClick={() => handleListNFTClick()}
                      />
                    )}
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
                  <div
                    className={styles.close}
                    onClick={() => {
                      setShowLoading(false)
                      setPrice(null)
                      onClose('list-close')
                      setTimeout(() => {
                        setListStatus(false)
                      }, 1000)
                    }}
                  >
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
                  {data?.json?.category === 'video' || data?.json?.properties?.category === 'video' ? (
                    <div
                      className="mt-[25px]"
                      dangerouslySetInnerHTML={{
                        __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data?.json?.animation_url} type="video/mp4" /></video>`,
                      }}
                    />
                  ) : (
                    <img
                      src={
                        data?.json?.image === undefined || data?.json?.image === null
                          ? AudioPlayerBackground.src
                          : data?.json?.image
                      }
                      alt={data?.json.name || data?.name}
                      className="w-full aspect-[321/321] object-cover mt-[25px] rounded-[16px]"
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
                        setShowLoading(false)
                        setPrice(null)
                        onClose('listed')
                        setTimeout(() => {
                          setListStatus(false)
                        }, 1000)
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

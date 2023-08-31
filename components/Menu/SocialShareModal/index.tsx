import { Fragment } from 'react'
import { useRouter } from 'next/router'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources
import FileCopyIcon from 'assets/icons/copy-alt-white-16x16.svg?component'
import TwitterUnfilledWhiteIcon from 'assets/icons/twitter-white-16x16.svg?component'
import FacebookWhiteIcon from 'assets/icons/facebook-white-16x16.svg?component'
import TelegramWhiteIcon from 'assets/icons/telegram-white-16x16.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import nftsAPI from 'apis/nfts'
import { copyToClipboard } from 'utils/helpers'
import { FacebookShareButton, TelegramShareButton, TwitterShareButton } from 'react-share'

const SocialShareModal = props => {
  const { open, close, vote, voteCount, setVote, setVoteCount, message, url } = props
  const router = useRouter()
  const { id } = router.query

  const fullUrl = globalThis.window?.origin + url.replaceAll(' ', '%20')

  function shareNFTSocial(type) {
    nftsAPI.shareNft(type, id).then(
      response => {
        if (response !== null) {
          setVoteCount && setVoteCount(voteCount + 1)
          setVote && setVote(true)
        }
      },
      error => {
        console.log(error)
      }
    )
  }

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

        <div className="fixed inset-0">
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
                <div className="flex justify-center mt-[15px] mb-[15px]">
                  <div className={styles.share}>Share</div>
                </div>
                <div className="w-full flex justify-between px-[24px]">
                  <TelegramShareButton
                    title={message}
                    url={fullUrl}
                    beforeOnClick={close}
                    onShareWindowClose={() => {
                      shareNFTSocial('telegram')
                    }}
                    className="w-full outline-none border-none drop-shadow-none"
                  >
                    <div className={styles.menuItem}>
                      <div className="flex justify-center mb-[8px]">
                        <TelegramWhiteIcon alt="" />
                      </div>
                      Telegram
                    </div>
                  </TelegramShareButton>
                  <TwitterShareButton
                    title={message}
                    url={fullUrl}
                    beforeOnClick={close}
                    onShareWindowClose={() => {
                      shareNFTSocial('twitter')
                    }}
                    className="w-full outline-none border-none drop-shadow-none"
                  >
                    <div className={styles.menuItem}>
                      <div className="flex justify-center mb-[8px]">
                        <TwitterUnfilledWhiteIcon alt="" />
                      </div>
                      X
                    </div>
                  </TwitterShareButton>
                  <FacebookShareButton
                    quote={message}
                    url={fullUrl}
                    beforeOnClick={close}
                    onShareWindowClose={() => {
                      shareNFTSocial('facebook')
                    }}
                    className="w-full outline-none border-none drop-shadow-none"
                  >
                    <div className={styles.menuItem}>
                      <div className="flex justify-center mb-[8px]">
                        <FacebookWhiteIcon alt="" />
                      </div>
                      Facebook
                    </div>
                  </FacebookShareButton>
                </div>
                <div className={styles.separator}></div>
                <div className="w-full flex justify-center mb-[30px]">
                  <div
                    className={styles.clipboard}
                    onClick={() => {
                      copyToClipboard(fullUrl)
                      close()
                    }}
                  >
                    <FileCopyIcon alt="" />
                    Copy link
                  </div>
                </div>

                {/* <div className="w-full flex justify-center">
                  <div className={styles.cancel} onClick={close}>
                    Cancel
                  </div>
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SocialShareModal

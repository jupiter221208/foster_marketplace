import { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import GradientButton from 'components/Button/GradientButton'

// icons
import CrossPlusIcon from 'assets/icons/cross-plus.svg?component'
import TrashIcon from 'assets/icons/trash-icon.svg?component'

// styles
import styles from './index.module.scss'

const AddTokenModal = props => {
  const { open, onClose, onImportUrl } = props

  const closeModal = () => {
    setTokenList([{ token_id: '' }])
    onClose()
  }

  const [url, setUrl] = useState('')
  const [tokenList, setTokenList] = useState([{ token_id: '' }])

  useEffect(() => {}, [])

  const addAnotherToken = () => {
    if (tokenList.length === 5) return
    setTokenList([...tokenList, { token_id: '' }])
  }

  const removeToken = index => {
    if (tokenList.length === 1) return
    let list = [...tokenList]
    list.splice(index, 1)
    setTokenList(list)
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
                <div className={styles.close} onClick={closeModal}>
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
                <div className="flex items-center mt-[10px] mb-[30px]">
                  <div className={styles.topic}>Add Token IDs</div>
                  <div className={`lg:block hidden ${styles.astro}`}>&nbsp;* </div>
                </div>
                <div className={styles.description}>
                  Enter the token IDs for the artworks you would like to import to this collection
                </div>

                <div className="max-h-[350px] w-full mt-[30px]">
                  {tokenList.map((token, index) => {
                    return (
                      <div className="flex gap-[18px] mb-[20px] items-center">
                        <div className={styles.tokenIndex}>{index + 1}</div>
                        <input
                          className={styles.inputArea}
                          value={token.token_id}
                          placeholder={'Enter token ID'}
                          onChange={event => setUrl(event.target.value)}
                        />
                        <TrashIcon onClick={() => removeToken(index)} />
                      </div>
                    )
                  })}
                </div>
                <div className={styles.button} onClick={() => addAnotherToken()}>
                  <CrossPlusIcon />
                  Add another token
                </div>
                <div className="w-full mt-[20px] lg:mt-[15px]">
                  <GradientButton
                    label="Import"
                    fullWidth
                    onClick={() => onImportUrl(url)}
                    backgroundColor="transparent"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AddTokenModal

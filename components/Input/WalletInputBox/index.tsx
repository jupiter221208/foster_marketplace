import React, { useState } from 'react'

// next components

// resource
import CrossPlusIcon from 'assets/icons/cross-plus.svg?component'
import TrashIcon from 'assets/icons/trash-icon.svg?component'

// styles
import styles from './index.module.scss'
import { getDisplayUserName } from 'utils/strings'
import { isValidPublicKey } from 'utils/wallet.util'
import { validDigits } from 'utils/helpers'

const WalletInputBox = props => {
  const { label, creatorList, setCreatorList } = props
  const [showAlert, setShowAlert] = useState(false)

  const setCreatorAddress = (index, value) => {
    let list = [...creatorList]
    list[index].address = value
    setCreatorList(list)
  }

  const setCreatorShare = (index, value) => {
    let list = [...creatorList]
    list[index].share = value
    setCreatorList(list)
  }

  const addAnotherCreator = () => {
    if (creatorList.length === 5) return

    let newList = []
    let count = creatorList.length
    let sharePros = Math.floor(100 / (count + 1)).toString()
    creatorList.map(creator => {
      creator.share = sharePros
      newList.push(creator)
    })
    newList.push({ address: '', share: sharePros, valid: true })
    setCreatorList(newList)
  }

  const removeCreator = index => {
    let list = [...creatorList]
    list.splice(index, 1)
    let count = list.length
    let sharePros = Math.floor(100 / count).toString()
    list.map(creator => {
      creator.share = sharePros
    })
    setCreatorList(list)
  }

  return (
    <div className="w-full">
      <div className={styles.roaylties}>Creator Royalties</div>
      <div className="w-full max-h-[350px] w-full mt-[15px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="flex gap-[15px] mb-[18px] items-center">
              <div className="w-full relative">
                <input
                  className={styles.inputArea}
                  value={index === 0 ? `${getDisplayUserName(address)} (your address)` : address}
                  placeholder={'Enter wallet address'}
                  disabled={index === 0}
                  onChange={event => {
                    setCreatorAddress(index, event.target.value)
                  }}
                />
                {isValidPublicKey(address) ? null : (
                  <div className={styles.addressErrorText}>Please provide a valid Solana address</div>
                )}
              </div>
              {creatorList.length > 1 && (
                <input
                  className={styles.inputPros}
                  value={share}
                  placeholder={'100'}
                  onChange={event => {
                    let share = validDigits(event.target.value)
                    if (share === '') {
                      setCreatorShare(index, '')
                    } else {
                      setCreatorShare(index, event.target.value)
                    }
                  }}
                />
              )}
              {creatorList.length > 1 && (
                <div className="w-[24px]">{index > 0 && <TrashIcon onClick={() => removeCreator(index)} />}</div>
              )}
            </div>
          )
        })}
      </div>
      {showAlert && <div className={styles.prosErrorText}>Total Percentage should be 100%</div>}
      <div className={styles.button} onClick={() => addAnotherCreator()}>
        <CrossPlusIcon />
        Add another wallet
      </div>
    </div>
  )
}

export default WalletInputBox

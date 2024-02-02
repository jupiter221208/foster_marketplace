import React, { useEffect, useState } from 'react'

// components
import Input from 'components/Input'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'

// solana
import { PublicKey } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyCollectionNFTs } from 'utils/nfts.utils'

// custom functions
import { useViewport } from 'utils'
import { validDigits } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// resources
import LoadingButton from 'components/Button/LoadingButton'
import CrossPlusIcon from 'assets/icons/cross-plus.svg?component'
import TrashIcon from 'assets/icons/trash-icon.svg?component'
import Alert from 'components/Alert'

const Step03SingleNFTSection = props => {
  const {
    royalties,
    setRoyalties,
    setCollection,
    creatorList,
    setCreatorList,
    disabledNextButton,
    createNft,
    isMinting,
    onBack,
  } = props
  const viewport = useViewport()
  const { metaplex: mx } = useMetaplex()
  const [selectedCollectionName, setSelectedCollectionName] = useState(null)
  const [showAlert, setShowAlert] = useState(false)

  let alertData = [
    {
      id: 0,
      title: 'Percentage Error',
      description: `The sum of percentage should be 100%.`,
      type: 'warning',
    },
  ]
  const [collectionList, setCollectionList] = useState([])
  useEffect(() => {
    getMyCollectionNFTs(mx).then(setCollectionList)
  }, [mx])

  const chooseCollection = index => {
    if (index >= 0) {
      setCollection(collectionList[index])
      setSelectedCollectionName(collectionList[index]?.name)
    } else {
      setCollection(null)
      setSelectedCollectionName(null)
    }
  }

  const addAnotherCreator = () => {
    let totalShares = creatorList.reduce((total, { share }) => total + parseInt(share), 0)
    setCreatorList([...creatorList, { address: '', share: totalShares >= 100 ? '0' : (100 - totalShares).toString() }])
  }

  const removeCreator = index => {
    let list = [...creatorList]
    list.splice(index, 1)
    setCreatorList(list)
  }

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

  const createSingleNFT = () => {
    if (creatorList.length === 1 && creatorList[0].address === '') {
      createNft()
      return
    }

    let totalShares = creatorList.reduce((total, { share }) => total + parseInt(share), 0)
    if (totalShares === 100) {
      createNft()
    } else {
      setShowAlert(true)
    }
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-20`}>
        Royalties <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-5">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          label01="From 0 to 10%"
          min={0}
          onChange={value => {
            let royal = validDigits(value)
            if (royal > 10) setRoyalties(10)
            else setRoyalties(Math.floor(royal))
          }}
        />
      </div>
      <div className={styles.collaborationTitle}>Collaboration Split (optional)</div>
      <div className={styles.collaborationText}>
        Add collaborators to this NFT. The percentage splits will apply to both the primary and secondary sales.
      </div>

      <div className="max-w-[575px] max-h-[350px] w-full mt-[15px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="w-full flex mb-[20px] gap-[15px] items-center">
              <div className="w-full max-w-[540px] flex gap-[18px]">
                <input
                  className={styles.inputArea}
                  value={address}
                  disabled={index === 0}
                  placeholder={'Enter wallet address'}
                  onChange={event => {
                    setCreatorAddress(index, event.target.value)
                  }}
                />
                <input
                  className={styles.inputPros}
                  value={share}
                  placeholder={'100'}
                  onChange={event => {
                    let pros = validDigits(event.target.value)
                    if (pros === '') {
                      setCreatorShare(index, '')
                    } else {
                      setCreatorShare(index, event.target.value)
                    }
                  }}
                />
              </div>
              <div className="w-[20px]">{index > 0 && <TrashIcon onClick={() => removeCreator(index)} />}</div>
              {(() => {
                try {
                  if (index > 0) new PublicKey(address)
                  return null
                } catch (e) {
                  console.error(`could not construct public key: ${address}`)
                  // TODO: show warning icon next to input
                  // return <WarningIcon tooltip="" />
                }
              })()}
            </div>
          )
        })}
      </div>
      <div className="max-w-[575px] w-full pr-[35px]">
        <div className={styles.button} onClick={() => addAnotherCreator()}>
          <CrossPlusIcon />
          Add another wallet
        </div>
      </div>
      {/* <div className="w-full mt-[54px]">
        <div className={styles.subTitle}>Add to an existing collection (optional)</div>
        <SelectCollectionMenu
          collections={collectionList}
          name={selectedCollectionName}
          onClick={index => chooseCollection(index)}
        />
      </div> */}
      <div className="w-full flex justify-end mt-[50px]">
        <div className="flex gap-10">
          <div>
            <Button
              label="Back"
              onClick={() => onBack()}
              backgroundColor={'transparent'}
              borderColor={'var(--back-btn-border-mobile)'}
              borderWidth={1}
              color="var(--main-bg-color)"
              width={viewport === '2xl' ? 124 : 117}
              height={viewport === '2xl' ? 53 : 46}
            />
          </div>
          <div>
            {royalties === '' || parseInt(royalties) < 0 || parseInt(royalties) > 10 ? (
              <Button
                width={viewport === '2xl' ? 124 : 117}
                height={viewport === '2xl' ? 53 : 46}
                label="Mint NFT"
                disabled={disabledNextButton}
                backgroundColor="#888A8E"
              />
            ) : isMinting ? (
              <LoadingButton width={viewport === '2xl' ? 124 : 117} height={viewport === '2xl' ? 53 : 46} />
            ) : (
              <GradientButton
                width={viewport === '2xl' ? 124 : 117}
                label="Mint NFT"
                onClick={() => createSingleNFT()}
              />
            )}
          </div>
        </div>
      </div>
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  ) : (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-5`}>
        Royalties <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-4">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          backgroundColor={'var(--shipping-board-bg)'}
          label01="From 0 to 10%"
          color={'var(--text-gray-200-color)'}
          min={0}
          onChange={value => {
            let royal = validDigits(value)
            if (royal > 10) setRoyalties(10)
            else setRoyalties(Math.floor(royal))
          }}
        />
      </div>
      <div className={styles.collaborationTitle}>Royalty Split (optional)</div>
      <div className={styles.collaborationText}>
        Add collaborators to this NFT. The percentage splits will apply to both the primary and secondary sales.
      </div>
      <div className="max-w-[540px] max-h-[350px] w-full mt-[18px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="flex gap-[10px] mb-[20px] items-center">
              <input
                className={styles.inputArea}
                value={address}
                placeholder={'Enter wallet address'}
                disabled={index === 0}
                onChange={event => {
                  setCreatorAddress(index, event.target.value)
                }}
              />
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
              {index > 0 && (
                <div className="w-[20px]">
                  <TrashIcon onClick={() => removeCreator(index)} />
                </div>
              )}
              <div className="w-[20px]">{index > 0 && <TrashIcon onClick={() => removeCreator(index)} />}</div>
              {(() => {
                try {
                  if (index > 0) new PublicKey(address)
                  return null
                } catch (e) {
                  console.error(`could not construct public key: ${address}`)
                  // TODO: show warning icon next to input
                  // return <WarningIcon tooltip="" />
                }
              })()}
            </div>
          )
        })}
      </div>
      <div className={styles.button} onClick={() => addAnotherCreator()}>
        <CrossPlusIcon />
        Add another wallet
      </div>

      {/* <div className="w-full mt-[54px]">
        <div className={styles.subTitle}>Add to an existing collection (optional)</div>
        <SelectCollectionMenu
          collections={collectionList}
          name={selectedCollectionName}
          onClick={index => chooseCollection(index)}
        />
      </div> */}
      <div className="w-full flex gap-2 mt-[100px]">
        <Button
          label="Back"
          fullWidth
          onClick={() => onBack()}
          backgroundColor={'transparent'}
          borderColor={'var(--back-btn-border-mobile)'}
          borderWidth={1}
          color="var(--main-bg-color)"
          height={40}
        />

        {royalties === '' || parseInt(royalties) < 0 || parseInt(royalties) > 10 ? (
          <Button label="Mint NFT" fullWidth disabled={disabledNextButton} backgroundColor="#888A8E" />
        ) : isMinting ? (
          <LoadingButton fullWidth height={40} />
        ) : (
          <GradientButton label="Mint NFT" onClick={() => createSingleNFT()} fullWidth />
        )}
      </div>
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default Step03SingleNFTSection

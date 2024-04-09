import React, { useEffect, useState } from 'react'

// components
import Input from 'components/Input'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import SwipRadio from 'components/Radio/SwipRadio'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyCollectionNFTs } from 'utils/nfts.utils'

// custom functions
import { useViewport } from 'utils'
import { validDigits } from 'utils/helpers'
import { getDisplayUserName } from 'utils/strings'
import { isValidPublicKey } from 'utils/wallet.util'

// styles
import styles from './index.module.scss'

// resources
import CrossPlusIcon from 'assets/icons/cross-plus.svg?component'
import TrashIcon from 'assets/icons/trash-icon.svg?component'
import MaxNumberList from 'assets/json/single-nft/max-number-list.json'
import EditionList from 'assets/json/single-nft/edition-type.json'

const Step03SingleNFTSection = props => {
  const {
    type,
    setEditionType,
    setMaxSupply,
    royalties,
    setRoyalties,
    setCollection,
    creatorList,
    setCreatorList,
    disabledNextButton,
    setDisabledNextButton,
    onNextStep,
    onBack,
  } = props
  const viewport = useViewport()
  const { metaplex: mx } = useMetaplex()
  const [edition, setEdition] = useState(2)
  const [showAlert, setShowAlert] = useState(false)
  const [enableMintBtn, setEnableMintBtn] = useState(false)
  const [maxNum, setMaxNum] = useState(MaxNumberList[0])

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

  useEffect(() => {
    if (creatorList.length === 0) return

    if (creatorList.length === 1 && creatorList[0].address === '') {
      setShowAlert(false)
      setEnableMintBtn(true)
      setDisabledNextButton(false)
      return
    }

    let totalShares = creatorList.reduce((total, { share }) => total + parseInt(share), 0)
    if (totalShares === 100) {
      setDisabledNextButton(false)
      setShowAlert(false)
      setEnableMintBtn(true)
    } else {
      setDisabledNextButton(true)
      setShowAlert(true)
      setEnableMintBtn(false)
      return
    }

    let enabled = true
    for (let i = 0; i < creatorList.length; i++) {
      let creator = creatorList[i]
      if (creator.address.length === 0 || !isValidPublicKey(creator.address)) {
        setEnableMintBtn(false)
        enabled = false
        break
      }
    }
    setDisabledNextButton(!enabled)
  }, [creatorList])

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

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      {type !== 0 && (
        <div className="mb-[30px]">
          <div className={styles.subTitle}>
            Edition type <span>*</span>
          </div>
          <SwipRadio
            data={EditionList}
            selected={edition}
            onChange={item => {
              setEdition(item)
              setEditionType(item)
            }}
          />
          {edition['id'] === 0 && (
            <div className="mt-[30px]">
              <div className={styles.maxSupplyTitle}>
                Max Supply <span>*</span>
              </div>
              <div className={styles.editionDescription}>The max number of copies that will be created</div>
              <div className="flex flex-wrap gap-[20px] mt-[16px] lg:mt-[25px]">
                {MaxNumberList.map((item, index) => (
                  <div
                    key={index}
                    className={`${maxNum.id === item.id ? styles.selectSupply : styles.noneSupply}`}
                    onClick={() => {
                      setMaxNum(item)
                      setMaxSupply(item.value)
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              {maxNum['id'] === 3 && (
                <div className="max-w-[450px] mt-[45px]">
                  <div className={styles.maxTitle}>
                    Custom Supply <span>*</span>
                  </div>
                  <div className="mt-[15px]">
                    <Input
                      onChange={value => {
                        setMaxSupply(value)
                      }}
                      placeholder="Provide of maxmium supply of editions"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className={`${styles.subTitle}`}>
        Royalties <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-[15px]">
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
      <div className={styles.collaborationTitle}>Add Collaborators (optional)</div>
      <div className={styles.collaborationText}>The split percentage applies to royalties on secondary sales.</div>

      <div className="max-w-[575px] max-h-[370px] w-full mt-[15px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="w-full flex mb-[20px] gap-[15px] items-center">
              <div className="w-full max-w-[540px] flex gap-[18px]">
                <div className="w-full relative">
                  <input
                    className={styles.inputArea}
                    value={index === 0 ? `${getDisplayUserName(address)} (your address)` : address}
                    disabled={index === 0}
                    placeholder={'Enter wallet address'}
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
                      let pros = validDigits(event.target.value)
                      if (pros === '') {
                        setCreatorShare(index, '')
                      } else {
                        setCreatorShare(index, event.target.value)
                      }
                    }}
                  />
                )}
              </div>
              <div className="w-[20px]">{index > 0 && <TrashIcon onClick={() => removeCreator(index)} />}</div>
            </div>
          )
        })}
      </div>
      {showAlert && <div className={styles.prosErrorText}>Total Percentage should be 100%</div>}
      <div className="max-w-[575px] w-full pr-[35px]">
        <div className={styles.button} onClick={() => addAnotherCreator()}>
          <CrossPlusIcon />
          Add another wallet
        </div>
      </div>
      <div className="w-full flex justify-end mt-[50px]">
        <div className="flex gap-10"></div>
      </div>
    </div>
  ) : (
    <div className="w-full">
      {type !== 0 && (
        <div className="mt-[38px]">
          <div className={styles.subTitle}>
            Edition type <span>*</span>
          </div>
          <div className={styles.editionDescription}>Editions are created on-demand</div>
          <SwipRadio
            data={EditionList}
            selected={edition}
            onChange={item => {
              setEdition(item)
              setEditionType(item)
            }}
          />
          {edition['id'] === 0 && (
            <div className="mt-[36px]">
              <div className={styles.maxSupplyTitle}>
                Max Supply <span>*</span>
              </div>
              <div className={styles.editionDescription}>The max number of copies that will be created</div>
              <div className="flex flex-wrap gap-[20px] mt-[16px] lg:mt-[25px]">
                {MaxNumberList.map((item, index) => (
                  <div
                    key={index}
                    className={`${maxNum.id === item.id ? styles.selectSupply : styles.noneSupply}`}
                    onClick={() => {
                      setMaxNum(item)
                      setMaxSupply(item.value)
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>

              {maxNum['id'] === 3 && (
                <div className="max-w-[450px] mt-[40px]">
                  <div className={styles.maxTitle}>
                    Custom Supply <span>*</span>
                  </div>
                  <div className="mt-[15px]">
                    <Input
                      onChange={value => {
                        setMaxSupply(value)
                      }}
                      placeholder="Provide of maxmium supply of editions"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className={`${styles.subTitle} mt-[30px]`}>
        Royalties <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-[15px]">
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
      <div className={styles.collaborationTitle}>Add Collaborators (optional)</div>
      <div className={styles.collaborationText}>The split percentage applies to royalties on secondary sales.</div>
      <div className="max-w-[540px] max-h-[350px] w-full mt-[18px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="flex gap-[10px] mb-[20px] items-center">
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

      <div className="w-full flex flex-wrap gap-[18px] mt-[100px]">
        <Button
          label="Back"
          fullWidth
          onClick={() => onBack()}
          backgroundColor={'transparent'}
          borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
          borderWidth={1}
          color="var(--main-bg-color)"
          fontFamily="Muli-SemiBold"
          height={50}
          fontSize={18}
        />

        {royalties === '' ||
        parseInt(royalties) < 0 ||
        parseInt(royalties) > 10 ||
        !enableMintBtn ||
        creatorList.some(({ address }) => !isValidPublicKey(address)) ? (
          <Button
            fullWidth
            height={50}
            label="Next"
            disabled={disabledNextButton}
            backgroundColor="var(--second-home-bg)"
            color="rgba(var(--main-bg-color-rgb), 0.1)"
            fontFamily="Muli-SemiBold"
            fontSize={18}
          />
        ) : (
          <GradientButton
            label="Next"
            onClick={() => onNextStep()}
            fullWidth
            height={50}
            fontSize={18}
            borderColor="transparent"
            fontFamily="Muli-SemiBold"
          />
        )}
      </div>
    </div>
  )
}

export default Step03SingleNFTSection

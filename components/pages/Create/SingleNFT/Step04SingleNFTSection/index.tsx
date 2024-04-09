import React, { useEffect, useState } from 'react'

// components
import Input from 'components/Input'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyCollectionNFTs } from 'utils/nfts.utils'

// custom functions
import { useViewport } from 'utils'
import { getDisplayUserName } from 'utils/strings'
import { isValidPublicKey } from 'utils/wallet.util'

// styles
import styles from './index.module.scss'

// resources
import LoadingButton from 'components/Button/LoadingButton'
import Chip from 'components/Chip'

const Step04SingleNFTSection = props => {
  const {
    type,
    editionType,
    maxSupply,
    nftName,
    description,
    categoryList,
    royalties,
    creatorList,
    disabledNextButton,
    createNft,
    isMinting,
    onBack,
  } = props
  const viewport = useViewport()
  const { metaplex: mx } = useMetaplex()
  const [selectedCollectionName, setSelectedCollectionName] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [enableMintBtn, setEnableMintBtn] = useState(false)

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
    if (creatorList === null || creatorList.length === 0) return

    if (creatorList.length === 1 && creatorList[0].address === '') {
      setShowAlert(false)
      setEnableMintBtn(true)
      return
    }

    let totalShares = creatorList.reduce((total, { share }) => total + parseInt(share), 0)
    if (totalShares === 100) {
      setShowAlert(false)
      setEnableMintBtn(true)
    } else {
      setShowAlert(true)
      setEnableMintBtn(false)
    }

    for (let i = 0; i < creatorList.length; i++) {
      let creator = creatorList[i]
      if (creator.address.length === 0) {
        setEnableMintBtn(false)
        break
      }
    }
  }, [creatorList])

  const createSingleNFT = () => {
    createNft()
  }
  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={styles.nftName}>{nftName}</div>
      {description !== '' && (
        <div className="mt-[9px]">
          <div className={styles.descriptionText}>{description}</div>
        </div>
      )}

      {type !== 0 && (
        <div>
          <div className={`${styles.subTitle} mt-[30px] mb-[10px]`}>Token Type</div>
          <div className="w-[120px]">
            <Chip data={{ name: editionType?.name }} key={0} />
          </div>
          {editionType?.name === 'Limited Edition' && (
            <div>
              <div className={`${styles.subTitle} mt-[30px] mb-[10px]`}>Total Supply</div>
              <div className="w-[100px]">
                <Chip data={{ name: maxSupply + ' Editions' }} key={0} />
              </div>
            </div>
          )}
        </div>
      )}

      {categoryList && categoryList.length !== 0 && (
        <div className="mt-[30px]">
          <div className={styles.categories}>Categories</div>
          <div className="w-full flex flex-wrap justify-start items-center mt-[9px] gap-[10px]">
            {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
          </div>
        </div>
      )}
      <div className={`${styles.subTitle} mt-[30px]`}>Royalties</div>
      <div className="mt-[15px]">
        <Input
          value={royalties + '%'}
          width={65}
          height={27}
          fontFamily={'Muli-SemiBold'}
          fontSize={13}
          placeholder="Insert a royalty percentage"
          color={'var(--text-gray-200-color)'}
          onChange={() => {}}
          min={0}
        />
      </div>

      <div className={`${styles.collaborationTitle} mt-[30px]`}>Creator Shares</div>

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
                  />
                </div>
                {creatorList?.length > 1 && <input className={styles.inputPros} value={share} placeholder={'100'} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  ) : (
    <div className="w-full">
      <div className={styles.nftName}>{nftName}</div>
      {description !== '' && (
        <div className="mt-[9px]">
          <div className={styles.descriptionText}>{description}</div>
        </div>
      )}
      {type !== 0 && (
        <div>
          <div className={`${styles.subTitle} mt-[30px] mb-[10px]`}>Token Type</div>
          <div className="w-[120px]">
            <Chip data={{ name: editionType?.name }} key={0} />
          </div>
          {editionType?.name === 'Limited Edition' && (
            <div>
              <div className={`${styles.subTitle} mt-[30px] mb-[10px]`}>Total Supply</div>
              <div className="w-[100px]">
                <Chip data={{ name: maxSupply + ' Editions' }} key={0} />
              </div>
            </div>
          )}
        </div>
      )}

      {categoryList && categoryList.length !== 0 && (
        <div className="mt-[30px]">
          <div className={styles.categories}>Categories</div>
          <div className="w-full flex flex-wrap justify-start items-center mt-[9px] gap-[10px]">
            {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
          </div>
        </div>
      )}
      <div className={`${styles.subTitle} mt-[30px]`}>Royalties</div>

      <div className="mt-[15px]">
        <Input
          value={royalties + '%'}
          width={65}
          height={27}
          placeholder="Insert a royalty percentage"
          color={'var(--text-gray-200-color)'}
          min={0}
        />
      </div>
      <div className={styles.collaborationTitle}>Creator Shares</div>

      <div className="max-w-[540px] max-h-[350px] w-full mt-[15px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="flex gap-[10px] mb-[20px] items-center">
              <div className="w-full relative">
                <input
                  className={styles.inputArea}
                  value={index === 0 ? `${getDisplayUserName(address)} (your address)` : address}
                  placeholder={'Enter wallet address'}
                  disabled={index === 0}
                />
              </div>
              {creatorList?.length > 1 && <input className={styles.inputPros} value={share} placeholder={'100'} />}
            </div>
          )
        })}
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
          height={45}
          fontSize={16}
        />

        {royalties === '' ||
        parseInt(royalties) < 0 ||
        parseInt(royalties) > 10 ||
        !enableMintBtn ||
        creatorList.some(({ address }) => !isValidPublicKey(address)) ? (
          <Button
            fullWidth
            height={45}
            label="Mint"
            disabled={disabledNextButton}
            backgroundColor="var(--second-home-bg)"
            color="rgba(var(--main-bg-color-rgb), 0.5)"
            fontFamily="Muli-SemiBold"
            fontSize={18}
          />
        ) : isMinting ? (
          <LoadingButton fullWidth height={45} />
        ) : (
          <GradientButton
            label="Mint"
            onClick={() => createSingleNFT()}
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

export default Step04SingleNFTSection

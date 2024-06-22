import React, { useEffect, useState } from 'react'

// components
import Input from 'components/Input'
import GradientButton from 'components/Button/GradientButton'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyCollectionNFTs } from 'utils/nfts.utils'

// custom functions
import { useViewport } from 'utils'
import { getDisplayUserName } from 'utils/strings'

// styles
import styles from './index.module.scss'

// resources
import Chip from 'components/Chip'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import OutlineButton from 'components/Button/OutlineButton'

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
  const [displayCategory, setDisplayCategory] = useState(false)

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
    if (categoryList) {
      let list = categoryList.filter((item, index) => item.checked === true)
      if (list.length > 0) {
        setDisplayCategory(true)
      } else {
        setDisplayCategory(false)
      }
    }
  }, [categoryList])

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
      <div className={styles.nftName}>Name</div>
      <div className={styles.descriptionText}>{nftName}</div>
      {description !== '' && (
        <div className="mt-[25px]">
          <div className={styles.nftName}>Description</div>
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

      {categoryList && displayCategory && categoryList.length !== 0 && (
        <div className="mt-[25px]">
          <div className={styles.nftName}>Categories</div>
          <div className="w-full flex flex-wrap justify-start items-center mt-[9px] gap-[10px]">
            {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
          </div>
        </div>
      )}
      <div className={`${styles.nftName} mt-[30px]`}>Royalties</div>
      <div className="mt-[15px]">
        <div className={styles.descriptionText}>{royalties + '%'}</div>
      </div>

      <div className={`${styles.nftName} mt-[30px]`}>Creators</div>

      <div className="max-w-[575px] max-h-[370px] w-full mt-[15px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="w-full flex mb-[10px] gap-[15px] items-center">
              <div className="w-full max-w-[540px] flex gap-[18px]">
                <div className="w-full flex gap-[9px]">
                  <div className={styles.addressText}>
                    {index === 0 ? `${getDisplayUserName(address)} (your address)` : getDisplayUserName(address)}
                  </div>
                  {creatorList?.length > 0 && <div className={styles.prosText}>{share + '%'}</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  ) : (
    <div className="w-full mt-[30px]">
      <div className={styles.nftName}>Name</div>
      <div className={styles.descriptionText}>{nftName}</div>

      {description !== '' && (
        <div className="mt-[25px]">
          <div className={styles.nftName}>Description</div>
          <div className={styles.descriptionText}>{description}</div>
        </div>
      )}
      {type !== 0 && (
        <div>
          <div className={`${styles.nftName} mt-[30px] mb-[10px]`}>Token Type</div>
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

      {categoryList && displayCategory && categoryList.length !== 0 && (
        <div className="mt-[30px]">
          <div className={styles.nftName}>Categories</div>
          <div className="w-full flex flex-wrap justify-start items-center mt-[9px] gap-[10px]">
            {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
          </div>
        </div>
      )}
      <div className={`${styles.nftName} mt-[30px]`}>Royalties</div>

      <div className="mt-[15px]">
        <div className={styles.descriptionText}>{royalties + '%'}</div>
      </div>

      <div className={`${styles.nftName} mt-[30px]`}>Creators</div>

      <div className="max-w-[540px] max-h-[350px] w-full mt-[15px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="w-full flex mb-[10px] gap-[15px] items-center">
              <div className="w-full max-w-[540px] flex gap-[18px]">
                <div className="w-full flex gap-[9px]">
                  <div className={styles.addressText}>
                    {index === 0 ? `${getDisplayUserName(address)} (your address)` : getDisplayUserName(address)}
                  </div>
                  {creatorList?.length > 0 && <div className={styles.prosText}>{share + '%'}</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="w-full flex flex-wrap gap-[18px] mt-[30px]">
        <OutlineButton label="Back" fullWidth onClick={() => onBack()} />
        {isMinting ? (
          <LoadingPrimaryButton fullWidth />
        ) : (
          <GradientButton label="Mint" fullWidth onClick={() => createSingleNFT()} disabled={disabledNextButton} />
        )}
      </div>
    </div>
  )
}

export default Step04SingleNFTSection

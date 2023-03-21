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

// styles
import styles from './index.module.scss'

// resources
import SelectCollectionMenu from 'components/Menu/SelectCollectionMenu'

const Step03SingleNFTSection = props => {
  const { royalties, setRoyalties, setCollection, disabledNextButton, createNft } = props
  const viewport = useViewport()
  const { metaplex: mx } = useMetaplex()
  const [selectedCollectionName, setSelectedCollectionName] = useState(null)

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

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-20`}>Royalties *</div>
      <div className="max-w-[370px] w-full mt-5">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          label="From 0 to 10%"
          labelColor="#eff0f6"
          type="number"
          min={0}
          onChange={value => {
            if (value > 10) setRoyalties(10)
            else setRoyalties(Math.floor(value))
          }}
        />
      </div>
      <div className="w-full mt-[54px]">
        <div className={styles.subTitle}>Add to an existing collection (optional)</div>
        <SelectCollectionMenu
          collections={collectionList}
          name={selectedCollectionName}
          onClick={index => chooseCollection(index)}
        />
      </div>
      <div className="w-full mt-16">
        {royalties === '' || parseInt(royalties) < 0 || parseInt(royalties) > 10 ? (
          <Button
            width={viewport === '2xl' ? 124 : 117}
            height={viewport === '2xl' ? 53 : 46}
            label="Mint NFT"
            disabled={disabledNextButton}
            backgroundColor="#888A8E"
          />
        ) : (
          <GradientButton width={viewport === '2xl' ? 124 : 117} label="Mint NFT" onClick={() => createNft()} />
        )}
      </div>
    </div>
  ) : (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-5`}>Royalties *</div>
      <div className="max-w-[370px] w-full mt-4">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          backgroundColor={'var(--input-bg)'}
          label="From 0 to 10%"
          type="number"
          min={0}
          onChange={value => {
            if (value > 10) setRoyalties(10)
            else setRoyalties(Math.floor(value))
          }}
        />
      </div>
      <div className="w-full mt-[54px]">
        <div className={styles.subTitle}>Add to an existing collection (optional)</div>
        <SelectCollectionMenu
          collections={collectionList}
          name={selectedCollectionName}
          onClick={index => chooseCollection(index)}
        />
      </div>
      <div className="w-full mt-10">
        {royalties === '' || parseInt(royalties) < 0 || parseInt(royalties) > 10 ? (
          <Button label="Mint NFT" fullWidth disabled={disabledNextButton} backgroundColor="#888A8E" />
        ) : (
          <GradientButton label="Mint NFT" onClick={() => createNft()} fullWidth />
        )}
      </div>
    </div>
  )
}

export default Step03SingleNFTSection

import React from 'react'

// components
import Input from 'components/Input'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const Step03SingleNFTSection = props => {
  const { royalties, setRoyalties, disabledNextButton, createNft } = props

  const viewport = useViewport()

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-20`}>Royalties *</div>
      <div className="max-w-[370px] w-full mt-5">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          label="From 0 to 10%"
          type="number"
          onChange={value => setRoyalties(value)}
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
          <GradientButton width={viewport === '2xl' ? 124 : 117} label="Mint NFT" onClick={createNft} />
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
          label="From 0 to 10%"
          type="number"
          onChange={value => setRoyalties(value)}
        />
      </div>
      <div className="w-full mt-10">
        {royalties === '' || parseInt(royalties) < 0 || parseInt(royalties) > 10 ? (
          <Button label="Mint NFT" fullWidth disabled={disabledNextButton} backgroundColor="#888A8E" />
        ) : (
          <GradientButton label="Mint NFT" onClick={createNft} fullWidth />
        )}
      </div>
    </div>
  )
}

export default Step03SingleNFTSection

import React, { useState } from 'react'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import Switch from 'components/Switch'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const PermissionAndPrivacySection = () => {
  const [userInteractionVisibility, setUserInteractionVisibility] = useState(false)
  const [viewPermissions, setViewPermissions] = useState(true)
  const [unlistedNFTPermissions, setUnlishtedNFTPermissions] = useState(false)
  const [listedNFTPermissions, setListedNFTPermissions] = useState(false)
  const [unlistedOffers, setUnlistedOffers] = useState(true)
  const [auctionWon, setAuctionWon] = useState(false)
  const [auctionSold, setAuctionSold] = useState(false)
  const [auctionCancelled, setAuctionCancelled] = useState(true)
  const [antiPhishingCode, setAntiPhishingcode] = useState(true)

  return (
    <div className={styles.container}>
      <div className="w-full hidden lg:flex justify-start">
        <div className={styles.title}>Permissions & Privacy</div>
      </div>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full mt-[30px] mb-12">
            <GreenLineCard content="Two-Factor authentication (2FA) is a good way to add an extra layer of security to your Foster account to make sure that only you have the ability to execute select transactions. Select which transactions you would like to enable 2FA." />
          </div>
          <div className="w-full flex flex-wrap gap-12 mb-[171px] lg:mb-[94px]">
            <Switch
              title="User Interaction Visibility"
              description="Share what I like with my connections"
              enabled={userInteractionVisibility}
              onChange={() => setUserInteractionVisibility(!userInteractionVisibility)}
            />
            <Switch
              title="View Permissions"
              description="Show my recently purchased artwork on marketplace discovery feeds"
              enabled={viewPermissions}
              onChange={() => setViewPermissions(!viewPermissions)}
            />
            <Switch
              title="Unlisted NFT Permissions"
              description="Show my minted NFTs on fresh mints discovery feed"
              enabled={unlistedNFTPermissions}
              onChange={() => setUnlishtedNFTPermissions(!unlistedNFTPermissions)}
            />
            <Switch
              title="Listed NFT Permissions"
              description="When someone bids in your auction"
              enabled={listedNFTPermissions}
              onChange={() => setListedNFTPermissions(!listedNFTPermissions)}
            />
            <Switch
              title="Unlisted Offers"
              description="Receive offers for your unlisted NFTs"
              enabled={unlistedOffers}
              onChange={() => setUnlistedOffers(!unlistedOffers)}
            />
            <Switch
              title="Auction Won"
              description="When you win an auction"
              enabled={auctionWon}
              onChange={() => setAuctionWon(!auctionWon)}
            />
            <Switch
              title="Auction Sold"
              description="When an auction you hosted end with a winner"
              enabled={auctionSold}
              onChange={() => setAuctionSold(!auctionSold)}
            />
            <Switch
              title="Auction Cancelled"
              description="When an auction you hosted ends without a winner"
              enabled={auctionCancelled}
              onChange={() => setAuctionCancelled(!auctionCancelled)}
            />
            <Switch
              title="Anti-Phishing Code"
              description="When someone bids on one of your items"
              enabled={antiPhishingCode}
              onChange={() => setAntiPhishingcode(!antiPhishingCode)}
            />
          </div>
          <div className="w-full flex justify-center mb-20">
            <GradientButton
              label="Save"
              onClick={() => {}}
              height="53px"
              paddingLeft="41px"
              paddingRight="41px"
              fontSize="18px"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionAndPrivacySection

import React, { useState } from 'react'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import Switch from 'components/Switch'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const DiscoverySection = props => {
  const { viewport } = props

  const [bidActivity, setBidActivity] = useState(false)
  const [bidAccepted, setBidAccepted] = useState(true)
  const [successfulSale, setSuccessfulSale] = useState(false)
  const [successfulPurchase, setSuccessfulPurchase] = useState(false)
  const [auctionOutbid, setAuctionOutbid] = useState(true)
  const [auctionWon, setAuctionWon] = useState(false)
  const [auctionBid, setAuctionBid] = useState(false)
  const [auctionExpiration, setAuctionExpiration] = useState(false)
  const [fosterNewsletter, setFosterNewsletter] = useState(false)

  return (
    <div className={styles.container}>
      <div className="w-full hidden lg:flex justify-start">
        <div className={styles.title}>Discovery</div>
      </div>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full mt-[30px] mb-12">
            <GreenLineCard content="Discovery settings allows you to choose how other users discover you, and how you discover NFTs, collections and artists" />
          </div>
          <div className="w-full flex flex-wrap gap-12 mb-[171px] lg:mb-[94px]">
            <Switch
              title="Bid Activity"
              description="When someone makes an offer on one of your items"
              enabled={bidActivity}
              onChange={() => setBidActivity(!bidActivity)}
            />
            <Switch
              title="Bid Accepted"
              description="When someone accepts your bid"
              enabled={bidAccepted}
              onChange={() => setBidAccepted(!bidAccepted)}
            />
            <Switch
              title="Successful Sale"
              description="When someone purchases one of your items"
              enabled={successfulSale}
              onChange={() => setSuccessfulSale(!successfulSale)}
            />
            <Switch
              title="Successful Purchase"
              description="When you successfully buy an item"
              enabled={successfulPurchase}
              onChange={() => setSuccessfulPurchase(!successfulPurchase)}
            />
            <Switch
              title="Auction Outbid"
              description="When an offer you placed is exceeded by another user"
              enabled={auctionOutbid}
              onChange={() => setAuctionOutbid(!auctionOutbid)}
            />
            <Switch
              title="Auction Won"
              description="When you win an auction"
              enabled={auctionWon}
              onChange={() => setAuctionWon(!auctionWon)}
            />
            <Switch
              title="Auction Bid"
              description="When someone bids in your auction"
              enabled={auctionBid}
              onChange={() => setAuctionBid(!auctionBid)}
            />
            <Switch
              title="Auction Expiration"
              description="When a timed auction you created ends"
              enabled={auctionExpiration}
              onChange={() => setAuctionExpiration(!auctionExpiration)}
            />
            <Switch
              title="Foster Newsletter"
              description="Occasional updates from the Foster team"
              enabled={fosterNewsletter}
              onChange={() => setFosterNewsletter(!fosterNewsletter)}
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

export default DiscoverySection

import React, { useState } from 'react'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import Switch from 'components/Switch'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const SecuritySection = () => {
  const [quickBuy, setQuickBuy] = useState(false)
  const [makeAnOffer, setMakeAnOffer] = useState(true)
  const [cancelOffer, setCancelOffer] = useState(false)
  const [depositFromMainWallet, setDepositFromMainWallet] = useState(false)
  const [withdrawToMainWallet, setWithDrawToMainWallet] = useState(true)
  const [acceptOffer, setAcceptOffer] = useState(true)
  const [listNFT, setListNFT] = useState(false)
  const [startAuction, setStartAuction] = useState(true)
  const [removeListing, setRemoveListing] = useState(false)

  return (
    <div className={styles.container}>
      <div className="w-full hidden lg:flex justify-start">
        <div className={styles.title}>Security</div>
      </div>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full mt-[30px] mb-12">
            <GreenLineCard content="Two-Factor authentication (2FA) is a good way to add an extra layer of security to your Foster account to make sure that only you have the ability to execute select transactions. Select which transactions you would like to enable 2FA." />
          </div>
          <div className="w-full flex flex-wrap gap-12 mb-[171px] lg:mb-[94px]">
            <Switch
              title="Quick Buy"
              description="Require 2FA before a quick purchase can be executed"
              enabled={quickBuy}
              onChange={() => setQuickBuy(!quickBuy)}
            />
            <Switch
              title="Make an Offer / Place Bid"
              description="Require 2FA before executing an outgoing offer or placing a bid"
              enabled={makeAnOffer}
              onChange={() => setMakeAnOffer(!makeAnOffer)}
            />
            <Switch
              title="Cancel Offer"
              description="Require 2FA before an offer I made can be cancelled"
              enabled={cancelOffer}
              onChange={() => setCancelOffer(!cancelOffer)}
            />
            <Switch
              title="Deposit from Main Wallet"
              description="Require 2FA before depositing funds from my main wallet to my bidding wallet"
              enabled={depositFromMainWallet}
              onChange={() => setDepositFromMainWallet(!depositFromMainWallet)}
            />
            <Switch
              title="Withdraw to Main Wallet"
              description="Require 2FA before withdrawing funds from my bidding wallet to my main wallet"
              enabled={withdrawToMainWallet}
              onChange={() => setWithDrawToMainWallet(!withdrawToMainWallet)}
            />
            <Switch
              title="Accept Offer"
              description="Require 2FA before an offer can be accepted"
              enabled={acceptOffer}
              onChange={() => setAcceptOffer(!acceptOffer)}
            />
            <Switch
              title="List NFT"
              description="Require 2FA before listing an NFT for sale via fixed-price"
              enabled={listNFT}
              onChange={() => setListNFT(!listNFT)}
            />
            <Switch
              title="Start Auction"
              description="Require 2FA before starting an auction"
              enabled={startAuction}
              onChange={() => setStartAuction(!startAuction)}
            />
            <Switch
              title="Remove Listing"
              description="Require 2FA before a fixed-price listing can be removed"
              enabled={removeListing}
              onChange={() => setRemoveListing(!removeListing)}
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

export default SecuritySection

import React, { useState, useEffect } from 'react'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import Switch from 'components/Switch'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

// call apis
import notificationAPI from 'apis/notification'
import { useViewport } from 'utils'

const NotificationSection = prop => {
  const { success } = prop
  const viewport = useViewport()
  const [oldSettings, setOldSettings] = useState({})
  const [enableSave, setEnableSave] = useState(false)
  const [bidActivity, setBidActivity] = useState(false)
  const [bidAccepted, setBidAccepted] = useState(false)
  const [successfulSale, setSuccessfulSale] = useState(false)
  const [successfulBid, setSuccessfulBid] = useState(false)
  const [auctionOutbid, setAuctionOutbid] = useState(true)
  // const [auctionWon, setAuctionWon] = useState(false)
  // const [auctionBid, setAuctionBid] = useState(false)
  // const [auctionExpiration, setAuctionExpiration] = useState(false)
  const [fosterNewsletter, setFosterNewsletter] = useState(false)

  useEffect(() => {
    notificationAPI.getNotifications().then(
      response => {
        if (response !== null) {
          const settings = response.notification_settings
          setBidActivity(settings.notify_on_offer)
          setBidAccepted(settings.notify_on_purchase)
          setSuccessfulSale(settings.notify_on_sale)
          setSuccessfulBid(settings.notify_on_bid)
          setOldSettings(settings)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  useEffect(() => {
    if (!oldSettings) return
    if (
      oldSettings['notify_on_offer'] !== bidActivity ||
      oldSettings['notify_on_purchase'] !== bidAccepted ||
      oldSettings['notify_on_sale'] !== successfulSale ||
      oldSettings['notify_on_bid'] !== successfulBid
    ) {
      setEnableSave(true)
      return
    }

    setEnableSave(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidActivity, bidAccepted, successfulSale, successfulBid])

  const handleSaveNotification = () => {
    if (!oldSettings) return

    const newSettings = { ...oldSettings }
    newSettings['notify_on_offer'] = bidActivity
    newSettings['notify_on_bid'] = bidAccepted
    newSettings['notify_on_sale'] = successfulSale
    newSettings['notify_on_purchase'] = successfulBid

    notificationAPI.updateNotificationSettings(newSettings).then(
      response => {
        if (response !== null) {
          setOldSettings({ ...newSettings })
          success()
          setEnableSave(false)
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  return (
    <div className={styles.container}>
      <div className="w-full flex justify-start">
        <div className={styles.content}>
          <div className="w-full mt-[10px] mb-12">
            <GreenLineCard
              className={styles.description}
              content="Select which notifications you would like to receive via email and provide the email address in your profile settings."
            />
          </div>
          <div className="w-full flex flex-wrap gap-12 mb-[60px] lg:mb-[94px]">
            <Switch
              title="Incoming Offers"
              description="When someone makes an offer on your artwork"
              enabled={bidActivity}
              onChange={() => setBidActivity(!bidActivity)}
            />
            <Switch
              title="Purchases"
              description="When you successfully purchase an item via offer, auction, or quick buy"
              enabled={bidAccepted}
              onChange={() => setBidAccepted(!bidAccepted)}
            />
            <Switch
              title="Sales"
              description="When someone purchases your artwork via quick buy or winning an auction"
              enabled={successfulSale}
              onChange={() => setSuccessfulSale(!successfulSale)}
            />
            <Switch
              title="Incoming Bids"
              description="When someone places a bid in an auction you published"
              enabled={successfulBid}
              onChange={() => setSuccessfulBid(!successfulBid)}
            />
            <Switch
              title="Auction Outbid"
              description="When a bid you placed is exceeded by another user"
              enabled={auctionOutbid}
              onChange={() => setAuctionOutbid(!auctionOutbid)}
            />
            <Switch
              title="Foster Newsletter"
              description="Occasional updates from the Foster team"
              enabled={fosterNewsletter}
              onChange={() => setFosterNewsletter(!fosterNewsletter)}
            />
          </div>
          <div className="w-full flex justify-end mb-[140px] lg:mb-20">
            <GradientButton
              label="Save"
              onClick={() => {
                if (enableSave) {
                  handleSaveNotification()
                }
              }}
              disabled={!enableSave}
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '100%' : ''}
              height="50px"
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

export default NotificationSection

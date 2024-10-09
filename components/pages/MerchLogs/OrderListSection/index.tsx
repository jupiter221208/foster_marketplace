import React, { useState } from 'react'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import WriteReviewModal from 'components/Modal/WriteReviewModal'
import Alert from 'components/Alert'
import ImageWithFoster from 'components/ImageWithFoster'

// styles
import styles from './index.module.scss'

const OrderListSection = props => {
  const {
    SSOrder,
    setShowShippedModal,
    orderData,
    orderDetails,
    orderVersion,
    merchType,
    paymentDetails,
    trackingDetails,
    helpTitle,
    helpBody,
    orderTabType,
    orderList,
    retryPayment,
  } = props
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [itemDetails, setItemDetails] = useState(null)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)

  return (
    <div>
      {!orderData ? (
        <div className="w-full flex justify-between mt-[30px]">
          <div className="flex gap-[77px]">
            <div className="w-[180px] h-[180px] object-cover">
              <div className="skeletonLoaderBasic w-[183px] h-[183px] rounded-[12px]"></div>
            </div>
            <div className="max-w-[300px]">
              <div className={styles.detailTitle}>Item Details</div>
              <div className="skeletonLoaderBasic w-[200px] h-[20px] rounded-full mt-[15px]"></div>
              <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[8px]"></div>
              <div className="skeletonLoaderBasic w-[200px] h-[20px] rounded-full mt-[8px]"></div>
              <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[8px]"></div>
              <div className="skeletonLoaderBasic w-[200px] h-[20px] rounded-full mt-[20px]"></div>
            </div>
          </div>
          <div>
            <div className="skeletonLoaderBasic w-[300px] h-[50px] rounded-[10px] mt-[15px]"></div>

            <div className="mt-[12px]">
              <div className="skeletonLoaderBasic w-[300px] h-[50px] rounded-[10px] mt-[15px]"></div>
            </div>
            <div className="mt-[12px]">
              <div className="skeletonLoaderBasic w-[300px] h-[50px] rounded-[10px] mt-[15px]"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex mt-[30px] gap-20">
          <div className="w-full flex flex-col gap-[37px] overflow-y-auto">
            {orderList &&
              orderList.map((item, index) => (
                <div key={index}>
                  <div className="w-full flex justify-between">
                    <div className="flex gap-[24px] lg:gap-[77px]">
                      <div className="min-w-[110px] lg:min-w-[180px] h-[110px] lg:h-[180px] rounded-[10px] overflow-hidden">
                        <ImageWithFoster width={360} src={item.fosterUrl} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-[14px] justify-between">
                        <div>
                          <div className={`hidden lg:block ${styles.detailTitle} mb-[15px]`}>Item Details</div>
                          <div className={`${styles.productName}`}>{item?.print}</div>
                          {orderDetails?.service === 'blinks' ? (
                            <div className={` ${styles.detailValue}`}>{item?.description}</div>
                          ) : (
                            item?.type !== 'user' && (
                              <div>
                                <div className={`${styles.detailValue}`}>Color:&nbsp;{item?.color}</div>
                                <div className={` ${styles.detailValue}`}>
                                  Size:&nbsp;
                                  {item?.size === 'S' || item?.size === 'YXS'
                                    ? 'Small'
                                    : item?.size === 'M' || item?.size === 'YS'
                                    ? 'Medium'
                                    : item?.size === 'L' || item?.size === 'YM'
                                    ? 'Large'
                                    : item?.size === 'XL' || item?.size === 'YL'
                                    ? 'X-Large'
                                    : item?.size === '2XL' || item?.size === 'YXL'
                                    ? '2X-Large'
                                    : ''}
                                </div>
                              </div>
                            )
                          )}
                          <div className={` ${styles.detailValue}`}>Qty:&nbsp;{item?.quantity}</div>
                          <div className={` ${styles.priceValue}`}>${item?.price?.toFixed(2)}</div>
                        </div>
                        {orderVersion === 'v2' && orderTabType !== 'seller' ? (
                          <div className="flex gap-[14px] items-center">
                            <div
                              className={styles.writeText}
                              onClick={() => {
                                setPreviewUrl(item.fosterUrl)
                                setItemDetails(item)
                                setShowReviewModal(true)
                              }}
                            >
                              Write a review
                            </div>
                            <div className={styles.border}></div>
                            <div className={styles.writeText}>View Item</div>
                          </div>
                        ) : (
                          <div className={styles.writeText}>View Item</div>
                        )}
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      {paymentDetails?.txId === null || paymentDetails?.txId?.length === 0 ? (
                        <div>
                          <GradientButton
                            width={335}
                            height={48}
                            label="Retry Payment"
                            onClick={() => retryPayment()}
                          />
                        </div>
                      ) : (
                        <div>
                          <OutlineButton
                            width={300}
                            label="Track package"
                            disabled={trackingDetails === null}
                            onClick={() => {
                              window.location.href = 'mailto:admin@Fostermarketplace.app'
                            }}
                          />
                        </div>
                      )}
                      <div className="mt-[12px]">
                        <a
                          href={`mailto:admin@Fostermarketplace.app?${new URLSearchParams({
                            subject: helpTitle,
                            body: helpBody,
                          })}`}
                        >
                          <OutlineButton
                            width={300}
                            label="Get help"
                            onClick={() => {
                              window.location.href = 'mailto:admin@Fostermarketplace.app'
                            }}
                          />
                        </a>
                      </div>

                      {SSOrder?.orderStatus !== 'shipped' && merchType === 'user' && orderTabType === 'seller' && (
                        <div className="mt-[12px]">
                          <GradientButton
                            width={335}
                            label="Mark as Shipped"
                            onClick={() => {
                              setShowShippedModal(true)
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.bottomBorder} />
                </div>
              ))}
          </div>
        </div>
      )}

      <WriteReviewModal
        open={showReviewModal}
        previewUrl={previewUrl}
        itemDetails={itemDetails}
        onClose={() => setShowReviewModal(false)}
        onSuccess={() => {
          setAlertData([
            {
              id: 0,
              title: 'Review Submitted!',
              description: 'Your review has been successfully sent to the seller',
              type: 'success',
            },
          ])
          setShowAlert(true)
        }}
      />

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

export default OrderListSection

import React, { useEffect } from 'react'
// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// json

import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

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
    setShowReviewModal,
    orderList,
    retryPayment,
  } = props

  return (
    <div>
      {!orderData ? (
        <div className="w-full flex justify-between mt-[30px]">
          <div className="w-[183px] h-[183px] object-cover">
            <div className="skeletonLoaderBasic w-[183px] h-[183px] rounded-[12px]"></div>
          </div>
          <div className="max-w-[300px]">
            <div className={styles.detailTitle}>Item Details</div>
            <div className="skeletonLoaderBasic w-[200px] h-[20px] rounded-full mt-[15px]"></div>
            <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[8px]"></div>
            <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[8px]"></div>
            <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[8px]"></div>
          </div>

          <div>
            <div className={styles.detailTitle}>Payment Details</div>
            <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[15px]"></div>
            <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[15px]"></div>
            <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[15px]"></div>
            <div className="skeletonLoaderBasic w-[260px] h-[20px] rounded-full mt-[15px]"></div>
            <div className="skeletonLoaderBasic w-[260px] h-[20px] rounded-full mt-[15px]"></div>
            {orderVersion === 'v1' && (
              <div className="skeletonLoaderBasic w-[200px] h-[20px] rounded-full mt-[15px]"></div>
            )}
            {orderVersion === 'v1' && (
              <div className="skeletonLoaderBasic w-[80px] h-[20px] rounded-full mt-[15px]"></div>
            )}

            <div className="skeletonLoaderBasic w-[50px] h-[20px] rounded-full mt-[15px]"></div>
          </div>

          <div>
            {paymentDetails?.txId === null || paymentDetails?.txId?.length === 0 ? (
              <div>
                <GradientButton width={335} height={48} label="Retry Payment" onClick={() => retryPayment()} />
              </div>
            ) : (
              <div>
                <OutlineButton
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
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
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
                  label="Get help"
                  onClick={() => {
                    window.location.href = 'mailto:admin@Fostermarketplace.app'
                  }}
                />
              </a>
            </div>

            {orderVersion === 'v2' && (
              <div className="mt-[12px]">
                <OutlineButton
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
                  label="Write a product review"
                  disabled={orderTabType === 'seller'}
                  onClick={() => {
                    setShowReviewModal(true)
                  }}
                />
              </div>
            )}

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
      ) : (
        <div className="w-full flex mt-[30px] gap-20">
          <div className="w-full flex flex-col gap-[37px] overflow-y-auto">
            {orderList &&
              orderList.map((item, index) => (
                <div key={index}>
                  <div className="w-full flex justify-between">
                    <div className="flex gap-[77px]">
                      <div className="min-w-[180px] h-[180px] rounded-[10px] overflow-hidden">
                        <ImageWithFoster width={360} src={item.fosterUrl} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-[14px] justify-between">
                        <div>
                          <div className={styles.detailTitle}>Item Details</div>
                          <div className={`mt-[15px] ${styles.productName}`}>{item?.print}</div>
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
                            <div className={styles.writeText}>Write a review</div>
                            <div className={styles.border}></div>
                            <div className={styles.writeText}>View Item</div>
                          </div>
                        ) : (
                          <div className={styles.writeText}>View Item</div>
                        )}
                      </div>
                    </div>
                    <div>
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

                      {/* {orderVersion === 'v2' && (
                      <div className="mt-[12px]">
                        <OutlineButton
                          width={335}
                          label="Write a product review"
                          disabled={orderTabType === 'seller'}
                          onClick={() => {
                            setShowReviewModal(true)
                          }}
                        />
                      </div>
                    )} */}

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

          {/* <div className="flex w-1/2 justify-between">
            <div>
                <div className={styles.detailTitle}>Payment Details</div>
                {SSOrder?.billTo && (
                  <div className={`mt-[15px] ${styles.detailValue}`}>Buyer:&nbsp;{SSOrder?.billTo?.name}</div>
                )}
                {SSOrder?.billTo && (
                  <div className={`mt-[15px] ${styles.detailValue}`}>
                    Buyer&nbsp;Email:&nbsp;
                    <span
                      className={styles.buyerEmail}
                      onClick={() => {
                        window.location.href = 'mailto:' + SSOrder?.customerEmail
                      }}
                    >
                      {SSOrder?.customerEmail}
                    </span>
                  </div>
                )}
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Payment&nbsp;Method:&nbsp;{paymentDetails?.method}
                </div>
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Payment&nbsp;Status:&nbsp;{paymentDetails?.txId?.length > 0 ? paymentDetails?.status : 'Pending'}
                </div>

                {paymentDetails?.paidBy && (
                  <div className={`mt-[15px] ${styles.detailValue}`}>
                    Paid&nbsp;by:&nbsp;{getShortAddress(paymentDetails?.paidBy)}
                  </div>
                )}
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Shipping&nbsp;&&nbsp;Handling:&nbsp;${paymentDetails?.shipping}
                </div>
                <div className={`mt-[15px] ${styles.detailValue}`}>Tax:&nbsp;${paymentDetails?.tax}</div>
              </div>
          </div> */}
        </div>
      )}
    </div>
  )
}

export default OrderListSection

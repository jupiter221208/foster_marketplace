import React from 'react'

// next components
import Image from 'next/image'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// styles
import styles from './index.module.scss'

const NotificationsCard = props => {
  const { viewport, data } = props
  console.log('viewport', viewport)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {data.map((item, index) => (
          <div className="" key={index}>
            <div className={styles.title}>{item.date}</div>
            <div className="mt-[25px] w-full flex flex-wrap gap-7">
              {item.data.map((elem, idx) => (
                <div className="w-full flex justify-between items-center" key={idx}>
                  <div className="flex justify-start items-center">
                    <div className={styles.dot} />
                    <div className={styles.avatarArea}>
                      <Image
                        src={elem.avatar}
                        alt=""
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                        cover="object-fit"
                        className="rounded-full"
                      />
                    </div>
                    <div className="block items-start">
                      <p>
                        <span className={styles.username}>{elem.username}</span>
                        <span className={styles.description}>&nbsp;{elem.description}</span>
                      </p>
                      {elem.viewDetails && <div className={styles.viewDetails}>View Details</div>}
                    </div>
                  </div>
                  <div>
                    {elem.status === '' && (
                      <Image
                        src={elem.image}
                        alt=""
                        width={56}
                        height={56}
                        cover="object-fit"
                        className="border-[15px]"
                      />
                    )}
                    {elem.status === 'Follow' && <GradientButton label="Follow" onClick={() => {}} />}
                    {elem.status === 'Following' && <OutlineButton label="Following" onClick={() => {}} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsCard

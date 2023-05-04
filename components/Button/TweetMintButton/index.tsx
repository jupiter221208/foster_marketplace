import React from 'react'

// next components
// import Image from 'next/image'

// styles
import styles from './index.module.scss'
// import TwitterBackgroundBlackIcon from 'assets/icons/twitter-background-black.svg'
// import TwitterBackgroundGreenIcon from 'assets/icons/twitter-background-green.svg'

const TweetMintButton = props => {
  const {
    label,
    onClick,
    fullWidth,
    color,
    backgroundColor01,
    backgroundColor02,
    width = '',
    height = '',
    direction = 'ltr',
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: `linear-gradient(to left, ${backgroundColor01}, ${backgroundColor02})`,
        height: height,
      }}
    >
      {direction === 'rtl' && (
        <div className="flex items-center mr-2 xl:mr-[15px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20.053" height="16.325" viewBox="0 0 20.053 16.325">
            <path
              id="twitter-7"
              d="M22.053,5.805a8.513,8.513,0,0,1-2.366.642A4.141,4.141,0,0,0,21.5,4.171a8.232,8.232,0,0,1-2.617,1,4.111,4.111,0,0,0-7.019,3.75,11.671,11.671,0,0,1-8.472-4.3A4.171,4.171,0,0,0,2.842,6.7a4.1,4.1,0,0,0,1.825,3.419A4.061,4.061,0,0,1,2.8,9.605v.05a4.111,4.111,0,0,0,3.309,4.011,3.94,3.94,0,0,1-1.1.17,4.913,4.913,0,0,1-.772-.07,4.121,4.121,0,0,0,3.84,2.848A8.242,8.242,0,0,1,3,18.378a7.952,7.952,0,0,1-1-.06,11.6,11.6,0,0,0,6.307,1.855A11.621,11.621,0,0,0,20.048,8.462V7.931a8.452,8.452,0,0,0,2.005-2.126Z"
              transform="translate(-2 -3.849)"
              fill="#202427"
            />
          </svg>
        </div>
      )}
      <div>{label}</div>
      {direction === 'ltr' && (
        <div className="flex items-center ml-2 xl:ml-[15px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20.053" height="16.325" viewBox="0 0 20.053 16.325">
            <path
              id="twitter-7"
              d="M22.053,5.805a8.513,8.513,0,0,1-2.366.642A4.141,4.141,0,0,0,21.5,4.171a8.232,8.232,0,0,1-2.617,1,4.111,4.111,0,0,0-7.019,3.75,11.671,11.671,0,0,1-8.472-4.3A4.171,4.171,0,0,0,2.842,6.7a4.1,4.1,0,0,0,1.825,3.419A4.061,4.061,0,0,1,2.8,9.605v.05a4.111,4.111,0,0,0,3.309,4.011,3.94,3.94,0,0,1-1.1.17,4.913,4.913,0,0,1-.772-.07,4.121,4.121,0,0,0,3.84,2.848A8.242,8.242,0,0,1,3,18.378a7.952,7.952,0,0,1-1-.06,11.6,11.6,0,0,0,6.307,1.855A11.621,11.621,0,0,0,20.048,8.462V7.931a8.452,8.452,0,0,0,2.005-2.126Z"
              transform="translate(-2 -3.849)"
              fill="var(--mint-btn-color)"
            />
          </svg>
        </div>
      )}
    </button>
  )
}

export default TweetMintButton

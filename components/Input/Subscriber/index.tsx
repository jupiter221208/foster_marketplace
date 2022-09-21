import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import FosterGreenIcon from 'assets/icons/foster-green.svg'

// styles
import styles from './index.module.scss'

const Subscriber = props => {
  const { value, placeholder, onChange, onClick } = props
  return (
    <div className={styles.container}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      <Image src={FosterGreenIcon} alt="" className="cursor-pointer" onClick={() => onClick()} />
    </div>
  )
}

export default Subscriber

import React from 'react'

// custom components
import { Switch as HSwitch } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const Switch = props => {
  const { title, description, enabled, onChange } = props

  return (
    <div className={styles.container}>
      <div className="block">
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div>
        <HSwitch
          checked={enabled}
          onChange={() => onChange()}
          className={`${
            enabled ? styles.active : styles.inactive
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`transform transition ease-in-out duration-200 ${
              enabled ? 'translate-x-5' : 'translate-x-1'
            } inline-block h-5 w-5 transform rounded-full bg-white`}
          />
        </HSwitch>
      </div>
    </div>
  )
}

export default Switch

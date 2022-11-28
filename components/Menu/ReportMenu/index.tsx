import React, { Fragment, useMemo, useState, useRef, useEffect } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// custom components
import IconButton from 'components/Button/IconButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import EllipseGroupWhiteIcon from 'assets/icons/ellipse-group-white.svg'
import SolanaSolLogoIcon from 'assets/icons/solana-sol-logo.svg'
import NounProhibitIcon from 'assets/icons/noun-prohibit-dark-red-16x16.svg'

// styles
import styles from './index.module.scss'

// solana
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'

const ReportMenu = props => {
  const { address } = props

  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, address), [address, connection])

  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <div className="flex justify-between items-center py-2">
            <Image src={EllipseGroupWhiteIcon} alt="" />
          </div>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={styles.menuBlur}>
            <div className={styles.menuArea}>
              <div className="absolute top-[9px] right-[11px]">
                <IconButton
                  icon={CloseWhiteIcon}
                  onClick={() => close()}
                  backgroundColor="#4B4B4B"
                  width="20px"
                  height="20px"
                  borderRadius="10px"
                  iconWidth={10}
                  iconHeight={10}
                />
              </div>
              <div className={styles.title}>Details</div>
              <div className={styles.divider} />
              <Menu.Item>
                {({ active }) => (
                  <div className={styles.menuItem}>
                    <Image src={SolanaSolLogoIcon} alt="" />
                    View on SolanaFM
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div className={styles.menuItem}>
                    <Image src={NounProhibitIcon} alt="" />
                    Report an Issue
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ReportMenu

import React, { Fragment, useMemo, useState, useRef, useEffect } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// custom functions
import { useViewport } from 'utils'

// custom components
import IconButton from 'components/Button/IconButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import EllipseGroupWhiteIcon from 'assets/icons/ellipse-group-white.svg'
import SolanaSolLogoIcon from 'assets/icons/solana-sol-logo.svg'
import SolanaSolLogoGrayIcon from 'assets/icons/solana-sol-logo-gray.svg'
import NounProhibitIcon from 'assets/icons/noun-prohibit-dark-red-16x16.svg'
import NounProhibitHoverIcon from 'assets/icons/noun-prohibit-dark-red-16x16-hover.svg'
import ThreeEllipseIcon from 'assets/icons/three-ellipse-white.svg'
import ThreeEllipseMobileIcon from 'assets/icons/three-ellipse-white-mobile.svg'

// styles
import styles from './index.module.scss'

// solana
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'
import { useSelector } from 'react-redux'

const ReportMenu = props => {
  const { address, onClick } = props
  const viewport = useViewport()
  const lightMode = useSelector(state => (state as any).lightMode)

  const [hover, setHover] = useState(false)
  const [hoverReport, setHoverReport] = useState(false)

  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, address), [address, connection])

  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <div className="flex justify-between items-center py-2">
            <div className={`${styles.ellipseArea} ${lightMode ? styles.lightEllipseArea : ''}`}>
              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <Image src={ThreeEllipseMobileIcon} alt="" width="16px" height="4px" />
              ) : (
                <Image src={ThreeEllipseIcon} alt="" width="16px" height="4px" />
              )}
            </div>
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
              <Menu.Item>
                {({ active }) => (
                  <div className="absolute top-[9px] right-[11px]">
                    <IconButton
                      icon={CloseWhiteIcon}
                      onClick={() => {}}
                      backgroundColor="#4B4B4B"
                      width="20px"
                      height="20px"
                      borderRadius="10px"
                      iconWidth={10}
                      iconHeight={10}
                    />
                  </div>
                )}
              </Menu.Item>
              <div className={styles.title}>Details</div>
              <div className={styles.divider} />
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={styles.menuItem}
                    onMouseEnter={() =>
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHover(true)
                    }
                    onMouseLeave={() =>
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHover(false)
                    }
                  >
                    <Image src={hover ? SolanaSolLogoIcon : SolanaSolLogoGrayIcon} alt="" />
                    <a target="_blank" href={explorerURL} rel="noopener noreferrer">
                      View on Solana Explorer
                    </a>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={styles.menuItem}
                    onClick={() => onClick()}
                    onMouseEnter={() =>
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHoverReport(true)
                    }
                    onMouseLeave={() =>
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHoverReport(false)
                    }
                  >
                    <Image src={hoverReport ? NounProhibitHoverIcon : NounProhibitIcon} alt="" />
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

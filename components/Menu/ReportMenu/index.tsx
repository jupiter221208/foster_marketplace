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
import SolanaSolLogoIcon from 'assets/icons/solana-sol-logo.svg'
import SolanaSolLogoGrayIcon from 'assets/icons/solana-sol-logo-gray.svg?component'
import NounProhibitIcon from 'assets/icons/noun-prohibit-dark-red-16x16.svg?component'
import NounProhibitHoverIcon from 'assets/icons/noun-prohibit-dark-red-16x16-hover.svg'
import PhysicalPrintIcon from 'assets/icons/physical-print-icon.svg?component'
import PhysicalPrintHoverIcon from 'assets/icons/physical-print-hover.svg?component'
import ThreeEllipseIcon from 'assets/icons/three-ellipse-white.svg?component'
import ThreeEllipseMobileIcon from 'assets/icons/three-ellipse-white-mobile.svg?component'

// styles
import styles from './index.module.scss'

// solana
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'

const ReportMenu = props => {
  const { address, onClickReport, onClickPrint, nftType } = props
  const viewport = useViewport()

  const [hover, setHover] = useState(false)
  const [hoverReport, setHoverReport] = useState(false)
  const [hoverPrint, setHoverPrint] = useState(false)

  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, address), [address, connection])

  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <div className="flex justify-between items-center">
            <div className={styles.ellipseArea}>
              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <ThreeEllipseMobileIcon alt="" />
              ) : (
                <ThreeEllipseIcon alt="" />
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
                    {hover ? <Image src={SolanaSolLogoIcon} alt="" /> : <SolanaSolLogoGrayIcon alt="" />}

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
                    onClick={() => onClickReport()}
                    onMouseEnter={() =>
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHoverReport(true)
                    }
                    onMouseLeave={() =>
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHoverReport(false)
                    }
                  >
                    {hoverReport ? <Image src={NounProhibitHoverIcon} alt="" /> : <NounProhibitIcon alt="" />}
                    Report an Issue
                  </div>
                )}
              </Menu.Item>
              {nftType.includes('image') && (
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={styles.menuItem}
                      onClick={() => onClickPrint()}
                      onMouseEnter={() =>
                        viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHoverPrint(true)
                      }
                      onMouseLeave={() =>
                        viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? {} : setHoverPrint(false)
                      }
                    >
                      {hoverPrint ? <PhysicalPrintHoverIcon alt="" /> : <PhysicalPrintIcon alt="" />}
                      Purchase Physical Print
                    </div>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ReportMenu

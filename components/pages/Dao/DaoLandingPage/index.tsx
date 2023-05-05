import React, { useState } from 'react'

// images and icons
import DAOLogoMobile from 'assets/icons/dao-logo-small-mobile.svg?component'
import SolIcon from 'assets/icons/solana-logo-dark-big.svg?component'
import SolMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-body.svg?component'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import StatsSearchBox from 'components/Input/StatsSearchBox'
import TableSection from './TableSection'
import ExplorePagination from 'components/Button/ExplorePagination'

const DaoLandingPage = () => {
  const viewport = useViewport()
  const [searchWord, setSearchWord] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowCount, setRowCount] = useState(10)

  const list = [
    {
      proposal: 'Add Creator Merch Hub to the Artist Page',
      category: 'Product',
      author: 'Angooba',
      time: 'Ends in 4 days',
      status: 'live',
    },
    {
      proposal: 'Add Creator Merch Hub to the Artist Page',
      category: 'Product',
      author: 'Angooba',
      time: 'Ends in 4 days',
      status: 'view',
    },
    {
      proposal: 'Add Creator Merch Hub to the Artist Page',
      category: 'Product',
      author: 'Angooba',
      time: 'Ends in 4 days',
      status: 'live',
    },
    {
      proposal: 'Add Creator Merch Hub to the Artist Page',
      category: 'Product',
      author: 'Angooba',
      time: 'Ends in 4 days',
      status: 'live',
    },
    {
      proposal: 'Add Creator Merch Hub to the Artist Page',
      category: 'Product',
      author: 'Angooba',
      time: 'Ends in 4 days',
      status: 'live',
    },
  ]

  const selectRowCount = count => {
    setRowCount(count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
  }

  return (
    <div className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div>
          <div className="w-full flex justify-between">
            <DAOLogoMobile />
            <div className="flex gap-[25px]">
              <div>
                <div className={styles.statsTitle}>All</div>
                <div className={styles.statsValue}>64</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Live</div>
                <div className={styles.statsValue}>64</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Pending</div>
                <div className={styles.statsValue}>64</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Closed</div>
                <div className={styles.statsValue}>64</div>
              </div>
            </div>
          </div>
          <div className={styles.landingTitle}>
            CircusDAO is the governance wing of Foster Marketplace composed of verified Turkey Circus holders. Circus
            DAO members can vote on proposals.
            <br />A minimum of&nbsp;<span className={styles.landingTitleBold}>10 Turkeys</span>
            &nbsp;is required to submit proposals.
          </div>
          <div className={styles.treasuryContainer}>
            <div>
              <div className={styles.treasuryLabel}>Treasury</div>
              <div className="flex gap-[40px]">
                <div className="flex gap-[15px] items-center">
                  <SolIcon />
                  <div className={styles.treasuryTitle}>25,000</div>
                </div>
                <div className={styles.treasuryDivider}></div>
                <div className="flex items-center">
                  <div className={styles.treasuryTitle}>$400,000</div>
                </div>
              </div>
            </div>
            <div className="max-w-[500px] flex gap-[45px] items-center">
              <div className={styles.treasuryDivider}></div>
              <div className={styles.treasuryDescription}>
                This treasury exists for Circus DAO participants to allocate resources for the long-term growth and
                prosperity of Foster Marketplace.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <DAOLogoMobile />
          </div>
          <div className={styles.landingTitle}>
            CircusDAO is the governance wing of Foster Marketplace composed of verified Turkey Circus holders. Circus
            DAO members can vote on proposals. A minimum of&nbsp;
            <span className={styles.landingTitleBold}>10 Turkeys</span>
            &nbsp;is required to submit proposals.
          </div>

          <div className="w-full flex flex-wrap gap-[5px] mt-[22px]">
            <div className="w-full flex gap-[5px]">
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>25</div>
                <div className={styles.statsTitle}>ALL</div>
              </div>
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>50</div>
                <div className={styles.statsTitle}>LIVE</div>
              </div>
            </div>
            <div className="w-full flex gap-[5px]">
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>13</div>
                <div className={styles.statsTitle}>PENDING</div>
              </div>
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>10</div>
                <div className={styles.statsTitle}>CLOSED</div>
              </div>
            </div>
          </div>

          <div className={styles.treasuryContainer}>
            <div className={styles.treasuryLabel}>Treasury</div>
            <div className="flex gap-[10px] mt-[10px]">
              <div className="flex gap-[10px] items-center">
                <SolMobileIcon />
                <div className={styles.treasuryTitle}>25,000</div>
              </div>
              <div className={styles.treasuryDivider}></div>
              <div className="flex items-center">
                <div className={styles.treasuryTitle}>$400,000</div>
              </div>
            </div>
            <div className={styles.treasuryDescription}>
              This treasury exists for Circus DAO participants to allocate resources for the long-term growth and
              prosperity of Foster Marketplace.
            </div>
          </div>
        </div>
      )}
      <div className="w-full hidden lg:mt-[77px] lg:flex justify-between">
        <StatsSearchBox
          value={searchWord}
          placeholder="Search by proposal name"
          onChange={value => setSearchWord(value)}
        />
        <div className={styles.submitProposal}>
          <NotificationIcon />
          <div className={styles.submitText}>Submit Proposal</div>
        </div>
      </div>

      <div className="w-full mt-[30px] lg:hidden justify-between">
        <div className="w-full flex justify-end mb-[15px]">
          <div className={styles.submitProposal}>
            <div className={styles.submitText}>Submit Proposal</div>
          </div>
        </div>
        <StatsSearchBox
          value={searchWord}
          placeholder="Search by proposal name"
          onChange={value => setSearchWord(value)}
        />
      </div>

      <div className="mt-[20px]">
        <TableSection data={list} />
      </div>
      <div className="w-full flex justify-end">
        <ExplorePagination
          currentPage={currentPage}
          totalCount={totalCount}
          rowCount={rowCount}
          setRowCount={count => {
            selectRowCount(count)
          }}
          handleNext={handleNextPage}
          handlePrev={handlePreviousPage}
        />
      </div>
    </div>
  )
}

export default DaoLandingPage

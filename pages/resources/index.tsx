import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ResourceSearchBox from 'components/Input/ResourceSearchBox'
import ResourcesCard from 'components/Card/ResourcesCard'
import ResourcesAccordion from 'components/Accordion/ResourcesAccordion'
import Pagination from 'components/Button/Pagination'

// images and icons
import PreviewImage from 'assets/images/preview-image.png'

// json
import ResourcesCardList from 'assets/json/resources/resources-card-list.json'
import QAList from 'assets/json/resources/qa-list.json'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'

const Resources = () => {
  const viewport = useViewport()
  const [selectedCard, setSelectedCard] = useState(-1)
  const [title, setTitle] = useState('')
  const [searchList, setSearchList] = useState(QAList[0])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [content, setContent] = useState<any[]>([])
  const [resourceList, setResourceList] = useState<any[]>([])

  useEffect(() => {
    setResourceList(ResourcesCardList)
  }, [])

  useEffect(() => {
    if (resourceList.length === 0) return
    if (selectedCard === -1) return
    setTitle(resourceList[selectedCard].title)
    setSearchList(QAList[selectedCard])
  }, [resourceList, selectedCard])

  useEffect(() => {
    if (selectedCard === -1) return
    if (viewport === 'xs' || viewport === 'sm' || viewport === 'md') return
    searchResearch()
  }, [searchKeyword, selectedCard])

  useEffect(() => {
    setContent(searchList.content)
  }, [searchList])

  const onClickSearch = () => {
    searchResearch()
  }

  const searchResearch = () => {
    let object = QAList[selectedCard]
    const searchResult = QAList[selectedCard].content.filter(
      element =>
        element.title.toLowerCase().includes(searchKeyword) ||
        !!element.description.find(elem => elem.toLowerCase().includes(searchKeyword))
    )
    object = { ...QAList[selectedCard], content: searchResult }
    setSearchList(object)
  }

  const setSelectResourceCard = index => {
    let lists = [...resourceList]
    if (lists[index].selected === true) {
      setSelectedCard(-1)
    } else {
      setSelectedCard(index)
    }
    lists.forEach(item => {
      if (item.id === index) {
        item.selected = !item.selected
      } else {
        item.selected = false
      }
    })
    setResourceList(lists)
  }

  const handleGetCurrentData = data => {
    setContent(data)
  }

  const handleClickAccordion = type => {
    switch (type) {
      case 'resource_lift':
        setSelectedCard(3)
        break
      case 'resource_turkey':
        setSelectedCard(2)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (viewport === 'xs' || viewport === 'sm' || viewport === 'md') {
      window.scrollTo({
        top: selectedCard * 160,
        behavior: 'smooth',
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [content])

  let pageTitle = 'Foster Marketplace | Resources'
  let pageImageUrl = PreviewImage.src
  let pageDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'

  return (
    <div className="g-container">
      <Head>
        <title>{pageTitle}</title>
        <meta property="description" content={pageDescription} />

        <meta name="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="og:image" content={pageImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={pageImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2321" height="2321" viewBox="0 0 2321 2321">
            <defs>
              <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
                <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle
              id="Ellipse_4322"
              data-name="Ellipse 4322"
              cx="1010.5"
              cy="1010.5"
              r="1010.5"
              transform="translate(150 150)"
              fill="url(#radial-gradient)"
            />
          </svg>
        </div>
        <div className="w-full flex flex-wrap z-10">
          <div className={`${styles.title} hidden lg:flex w-full text-center lg:text-start`}>Foster Resources</div>
          <div className="w-full flex justify-end mt-[15px] lg:mt-[61px]">
            <ResourceSearchBox
              value={searchKeyword}
              placeholder="Search by keywords"
              onChange={value => setSearchKeyword(value)}
              onClick={() => onClickSearch()}
            />
          </div>
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <div className="w-full flex flex-wrap gap-[20px] mt-[10px] lg:mt-[31px]">
              <div className="flex flex-wrap w-full lg:w-[366px] lg:min-w-[366px] h-fit gap-[10px]">
                {resourceList.map((item, index) => (
                  <div key={index} className="w-full">
                    <ResourcesCard
                      data={item}
                      selected={item.id === selectedCard}
                      onClick={id => setSelectResourceCard(id)}
                    />
                    {item.selected === true ? (
                      <div className="flex flex-1 h-fit">
                        <div className={styles.content}>
                          <div className="w-full flex flex-wrap gap-5">
                            <ResourcesAccordion
                              data={searchList.content}
                              onClick={type => handleClickAccordion(type)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-wrap gap-[20px] mt-[31px]">
              <div className="flex flex-wrap w-full lg:w-[366px] lg:min-w-[366px] h-fit gap-[10px]">
                {resourceList.map((item, index) => (
                  <div key={index} className="w-full">
                    <ResourcesCard
                      data={item}
                      selected={item.id === selectedCard}
                      onClick={id => {
                        if (selectedCard === id) {
                          setSelectedCard(-1)
                        } else {
                          setSelectedCard(id)
                        }
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-1">
                {selectedCard === -1 ? (
                  <div className={styles.empty}>Select a category to get started</div>
                ) : (
                  <div>
                    {selectedCard >= 0 && resourceList.length > 0 && (
                      <div className={styles.content}>
                        <div className="w-full flex flex-wrap gap-5">
                          <ResourcesAccordion data={content} onClick={type => handleClickAccordion(type)} />
                        </div>
                        <div className="w-full flex justify-end">
                          <Pagination data={searchList.content} getCurrentData={data => handleGetCurrentData(data)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Resources

Resources.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

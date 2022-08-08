import React from 'react'

// next components
import Image from 'next/image'

// custom components
import Checkbox from 'components/Checkbox'
import IconButton from 'components/Button/IconButton'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const CollectionFilesModal = props => {
  const { data, onClick } = props

  return (
    <div className={styles.menu}>
      <div className={styles.container}>
        <div className="w-full h-[68px] flex justify-between items-center">
          <div className={styles.title}>Collection Files</div>
          <IconButton icon={CloseWhiteIcon} onClick={() => onClick()} backgroundColor="transparent" />
        </div>
        <div className={styles.content}>
          <div className="w-full grid grid-cols-3 gap-4">
            {data.map((item, index) => (
              <div className="col-span-1" key={index}>
                <Image
                  src={URL.createObjectURL(item.file)}
                  alt=""
                  width={86}
                  height={86}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-[6px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionFilesModal

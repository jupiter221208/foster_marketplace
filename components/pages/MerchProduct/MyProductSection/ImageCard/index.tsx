import React, { useState } from 'react'

// third party components
import Dropzone from 'react-dropzone'

// image
import PlusIcon from 'assets/icons/plus-circle-icon.svg?component'

// json

// styles
import styles from './index.module.scss'

const ImageCard = props => {
  const { index, image, setImage, isSelected = false, onSelect, onDelete } = props
  const [showDelete, setShowDelete] = useState(false)
  return (
    <div className="w-[130px] h-[130px]" onClick={() => onSelect(index)}>
      {image ? (
        <div
          className={isSelected ? styles.selected : styles.noSelect}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
        >
          <img src={image} alt="" className="max-w-full max-h-full object-cover" />
          {showDelete && (
            <div className={styles.deleteArea}>
              <div onClick={() => onDelete(index)}>Delete</div>
            </div>
          )}
        </div>
      ) : (
        <Dropzone
          onDropAccepted={acceptedFiles => {
            if (acceptedFiles.length !== 0) {
              setImage(URL.createObjectURL(acceptedFiles[0]))
            } else setImage(null)
          }}
          onDropRejected={rejectedFiles => {
            setImage(null)
          }}
          accept={{
            'image/jpeg': [],
            'image/png': [],
          }}
          maxFiles={1}
          maxSize={10485760}
        >
          {({ getRootProps, getInputProps }) => (
            <section className={styles.dropzone}>
              <div {...getRootProps()} className={styles.selectArea}>
                <input {...getInputProps()} />
                <PlusIcon />
              </div>
            </section>
          )}
        </Dropzone>
      )}
    </div>
  )
}

export default ImageCard

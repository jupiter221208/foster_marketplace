import React from 'react'

// third party components
import Dropzone from 'react-dropzone'

// image
import PlusIcon from 'assets/icons/plus-circle-icon.svg?component'

// json

// styles
import styles from './index.module.scss'

const ImageCard = props => {
  const { index, image, setImage, isDelete = false, isSelected = false, onSelect } = props
  return (
    <div className="w-[130px] h-[130px]" onClick={() => onSelect(index)}>
      {image ? (
        <div className={isSelected ? styles.selected : styles.noSelect}>
          <img src={image} alt="" className="max-w-full max-h-full object-contain" />
          {isDelete && (
            <div className={styles.deleteArea}>
              <div onClick={() => setImage(null)}>Delete</div>
            </div>
          )}
        </div>
      ) : (
        <Dropzone
          onDropAccepted={acceptedFiles => {
            acceptedFiles.length !== 0 ? setImage(URL.createObjectURL(acceptedFiles[0])) : setImage(null)
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

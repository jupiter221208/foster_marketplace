import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import FosterGreenIcon from 'assets/icons/logo-color.svg'

// styles
import styles from './index.module.scss'

const Subscriber = props => {
  const { value, onChange, onClick } = props
  return (
    <div className={styles.container}>
      <div id="mc_embed_signup" className="w-[90%]">
        <form
          action="https://fostermarketplace.us13.list-manage.com/subscribe/post?u=cb2dcc0a1840febd16c695c90&amp;id=8171ec708a"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          target="_blank"
        >
          <div className="w-full flex">
            <input
              type="email"
              className={styles.inputArea}
              value={value}
              placeholder="Email"
              name="EMAIL"
              id="mce-EMAIL"
              onChange={event => onChange(event.target.value)}
            />
            <button type="submit" name="subscribe" id="mc-embedded-subscribe" className="mt-[4px]">
              <Image src={FosterGreenIcon} alt="" className="cursor-pointer" onClick={() => onClick()} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Subscriber

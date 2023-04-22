import Styles from './styles.module.css'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaArrowDown, FaCopy } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { BsXCircle } from 'react-icons/bs'

export const Lightbox = ({ gallery, close }) => {
	const [image, setImage] = useState(gallery[0])
	const sliderWrapperRef = useRef()

	function scrollForward() {
		sliderWrapperRef.current.scrollBy({ top: 0, left: 100, behavior: "smooth" })
	}

	function scrollBackward() {
		sliderWrapperRef.current.scrollBy({ top: 0, left: -100, behavior: "smooth" })
	}

	function copyImageUrl(text) {
		navigator.clipboard.writeText(text)
		alert("Image url copied: " + image.Image)
	}

	return (
		<div className={Styles.Wrapper}>
			<div className={Styles.ContentWrapper}>
				<div className={Styles.LargeImageViewWrapper}>
					<div className={Styles.LargeImageWrapper}>
						<Image className={Styles.LargeImage} alt={image.Text} src={image.Image} fill />
						<button type='button' className={Styles.CloseBtn} onClick={close}>
							<IconContext.Provider value={{ className: Styles.CloseBtnIcon }}>
								<BsXCircle />
							</IconContext.Provider>
						</button>

						<div className={Styles.HoverBtnGroup}>
							<button type='button' onClick={() => copyImageUrl(image.Image)}>
								<IconContext.Provider value={{ className: Styles.HoverBtnGroupIcon }}>
									<FaCopy />
								</IconContext.Provider>
							</button>
							<a href="" download={image.Image}>
								<IconContext.Provider value={{ className: Styles.HoverBtnGroupIcon }}>
									<FaArrowDown />
								</IconContext.Provider>
							</a>
						</div>
					</div>
				</div>

				<div className={Styles.ImagePreviewWrapper}>
					<button type='button' onClick={() => scrollBackward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Left}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaArrowLeft />
						</IconContext.Provider>
					</button>

					<div className={Styles.SliderWrapper} ref={sliderWrapperRef}>
						<div className={Styles.Slider} >
							{
								gallery.map((item, index) => (
									< div key={index} className={`${Styles.SliderItemWrapper} ${item.id === image.id ? Styles.ItemActive : ""}`} onClick={() => setImage(item)}>
										{console.log(item)}
										<Image className={Styles.SliderImage} alt={item.Text} src={item.Image} fill />
									</div>
								))
							}
						</div>
					</div>

					<button type='button' onClick={() => scrollForward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Right}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaArrowRight />
						</IconContext.Provider>
					</button>
				</div>
			</div>
		</div >
	)
}

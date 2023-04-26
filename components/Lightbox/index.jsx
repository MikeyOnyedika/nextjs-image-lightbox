import Styles from './styles.module.css'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { FaArrowDown, FaAngleRight, FaAngleLeft, FaEdit } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { CloseBtn } from './close'

export const Lightbox = ({ images, close }) => {
	const [imageIndex, setImageIndex] = useState(0)
	const maxIndex = images.length - 1
	const sliderWrapperRef = useRef()
	const largeImageViewWrapperRef = useRef()
	const [lastDirection, setLastDirection] = useState("right")
	const activeImageRef = useRef()
	const { observer, isVisible } = useIntersectionObserver()
	const direction = {
		LEFT: 'left',
		RIGHT: 'right'
	}


	useEffect(() => {
		if (activeImageRef.current != null) {
			console.log("observe")
			observer.observe(activeImageRef.current)
		}

		if (isVisible != null) {
			if (isVisible === false) {
				if (lastDirection === direction.LEFT) {
					scrollBackward()
				} else {
					scrollForward()
				}
			}
		}
	}, [imageIndex, isVisible])

	function scrollForward() {
		sliderWrapperRef.current.scrollBy({ top: 0, left: 200, behavior: "smooth" })
	}

	function scrollBackward() {
		sliderWrapperRef.current.scrollBy({ top: 0, left: -200, behavior: "smooth" })
	}

	function copyImageUrl(text) {
		navigator.clipboard.writeText(text)
		alert("Image url copied: " + images[imageIndex].Image)
	}

	function prevImage() {
		setLastDirection(direction.LEFT)
		setImageIndex(prev => {
			if (prev === 0) return prev
			return prev - 1
		})
	}

	function nextImage() {
		setLastDirection(direction.RIGHT)
		setImageIndex(prev => {
			if (prev === maxIndex) return prev
			return prev + 1
		})
	}



	return (
		<div className={Styles.Wrapper}>
			<div className={Styles.ContentWrapper}>
				<div className={Styles.LargeImageViewWrapper} ref={largeImageViewWrapperRef}>
					<div className={Styles.LargeImageWrapper} >
						<Image className={Styles.LargeImage} alt={images[imageIndex].text} src={images[imageIndex].image} fill />
						<button type='button' className={Styles.CloseBtn} onClick={close}>
							<CloseBtn />
						</button>

						<div className={Styles.HoverBtnGroup}>
							<button type='button' onClick={() => copyImageUrl(images[imageIndex].Image)} className={Styles.CopyBtn}>
								<IconContext.Provider value={{ className: Styles.HoverBtnGroupIcon }}>
									<FaEdit />
								</IconContext.Provider>
							</button>
							<a href="" download={images[imageIndex].Image}>
								<IconContext.Provider value={{ className: Styles.HoverBtnGroupIcon }}>
									<FaArrowDown />
								</IconContext.Provider>
							</a>
						</div>

						<button onClick={prevImage} className={Styles.Btn}>
							<IconContext.Provider value={{ className: `${Styles.LargeBtnIcon} ${Styles.Left}` }}>
								<FaAngleLeft />
							</IconContext.Provider>
						</button>


						<button onClick={nextImage} className={Styles.Btn}>
							<IconContext.Provider value={{ className: `${Styles.LargeBtnIcon} ${Styles.Right}` }}>
								<FaAngleRight />
							</IconContext.Provider>
						</button>
					</div>
				</div>

				<div className={Styles.ImagePreviewWrapper}>
					<button type='button' onClick={() => scrollBackward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Left}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaAngleLeft />
						</IconContext.Provider>
					</button>

					<div className={Styles.SliderWrapper} ref={sliderWrapperRef}>
						<ul className={Styles.Slider} >
							{
								images.map((item, index) => (
									<li key={index} className={`${Styles.SliderItemWrapper} ${item.id === images[imageIndex].id ? Styles.ItemActive : ""}`} onClick={() => setImageIndex(index)} tabIndex={0} ref={item.id === images[imageIndex].id ? activeImageRef : null}>
										<Image className={Styles.SliderImage} alt={item.text} src={item.image} fill />
									</li>
								))
							}
						</ul>
					</div>

					<button type='button' onClick={() => scrollForward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Right}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaAngleRight />
						</IconContext.Provider>
					</button>
				</div>
			</div>
		</div >
	)
}


function useIntersectionObserver() {
	const [isVisible, setIsVisible] = useState()
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.intersectionRatio > 0) {
				// element is visible
				setIsVisible(true)
			} else {
				// element is not visible
				setIsVisible(false)
			}
		})

	}, {
		root: null,
		rootMargin: '0px',
		threshold: 0
	})
	return {
		observer, isVisible
	}
}
# Scrollable React Lightbox
A Scrollable image lightbox written in reactjs

![screenshot](./public/lightbox_demo.png)

## Run project
- `npm i && npm run dev`

### Setup
```js
export default function Home(){
    const [images, setImages] = useState(null)

    function openLightbox(gallery) {
        setImages([
            {id: "ksdnak2323923239j2", text: "man on the moon", image: "./photos/man_on_moon.png"},
            {id: "kwfakfwke923029923", text: "rock climber", image: "./photos/rock_climber.png"},
            {id: "3022kl3lk23jrq_kww", text: "girl with flower", image: "./photos/girl_with_flower.png"},
            {id: "lkw292032ccic99902", text: "man on the moon", image: "./photos/man_on_moon.png"},
            {id: "a121990sdj092EE9jo2", text: "children playing in the rain", image: "./photos/playing_in_the_rain.png"},
        ])
    }

    function closeLightbox() {
        setImages(null)
    }
    return (
        <Lightbox images={images} close={closeLightbox} />
    )
}
```
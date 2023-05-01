import Mountain1 from "../public/mountain_1.jpg"
import Mountain2 from "../public/mountain_2.jpg"
import Mountain3 from "../public/mountain_3.jpg"
import Mountain4 from "../public/mountain_4.jpg"
import Mountain5 from "../public/mountain_5.jpg"
import Mountain6 from "../public/mountain_6.jpg"
import Mountain7 from "../public/mountain_7.jpg"
import Mountain8 from "../public/mountain_8.jpg"
import Mountain9 from "../public/mountain_9.jpg"
import Mountain10 from "../public/mountain_10.jpg"
import Mountain11 from "../public/mountain_11.jpg"
import Mountain12 from "../public/mountain_12.jpg"
import Mountain13 from "../public/mountain_13.jpg"
import Mountain14 from "../public/mountain_14.jpg"
import Mountain15 from "../public/mountain_15.jpg"

const letters = ['a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5']

function randomId(length) {
	let id = ""
	for (let i = 0; i < length; i++) {
		id += letters[Math.floor(Math.random() * letters.length)]
	}
	return id
}

let images = [
	{
		id: randomId(10),
		text: "Mountain 1",
		image: Mountain1
	},
	{
		id: randomId(10),
		text: "Mountain 2",
		image: Mountain2
	},
	{
		id: randomId(10),
		text: "Mountain 3",
		image: Mountain3
	},
	{
		id: randomId(10),
		text: "Mountain 4",
		image: Mountain4
	},
	{
		id: randomId(10),
		text: "Mountain 5",
		image: Mountain5
	},
	{
		id: randomId(10),
		text: "Mountain 6",
		image: Mountain6
	},
	{
		id: randomId(10),
		text: "Mountain 7",
		image: Mountain7
	},
	{
		id: randomId(10),
		text: "Mountain 8",
		image: Mountain8
	},
	{
		id: randomId(10),
		text: "Mountain 9",
		image: Mountain9
	},
	{
		id: randomId(10),
		text: "Mountain 10",
		image: Mountain10
	},
	{
		id: randomId(10),
		text: "Mountain 11",
		image: Mountain11
	},
	{
		id: randomId(10),
		text: "Mountain 12",
		image: Mountain12
	},
	{
		id: randomId(10),
		text: "Mountain 13",
		image: Mountain13
	},
	{
		id: randomId(10),
		text: "Mountain 14",
		image: Mountain14
	},
	{
		id: randomId(10),
		text: "Mountain 15",
		image: Mountain15
	},
]

export default images

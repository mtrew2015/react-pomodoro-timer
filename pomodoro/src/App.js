import React, { useState, useEffect } from 'react';
import { CirclePicker } from 'react-color';

import './App.scss';

function App() {
	const [ time, setTime ] = useState(1500);
	const [ active, setActive ] = useState(false);
	const [ count, setCount ] = useState(0);
	const [ onBreak, setOnBreak ] = useState(false);
	const [ bgColor, setbgColor ] = useState('#fff');

	const audio = new Audio('/bell.mp3');

	useEffect(
		() => {
			const shortOrLong = () => {
				if (count % 2 != 0) {
					return 600;
				} else {
					return 300;
				}
			};
			let int = null;
			document.title = onBreak ? `Break: ${formatTime()}` : `Work: ${formatTime()}`;
			if (active && time > 0) {
				int = setInterval(() => {
					setTime((time) => time - 1);
				}, 1000);
			} else {
				if (active && time === 0 && !onBreak) {
					setActive(false);
					setTime(shortOrLong());
					setOnBreak(true);
					setCount(count + 1);
					audio.play();
				} else if (onBreak && time === 0) {
					audio.play();
					setOnBreak(false);
					setTime(1500);
					clearInterval(int);
					setActive(false);
				}
			}
			return () => clearInterval(int);
		},
		[ onBreak, time, active, count, audio ]
	);

	const formatTime = () => {
		let minutes = Math.floor(time / 60);
		let seconds = time % 60;
		return `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
	};

	const toggleColor = () => {
		const color = document.getElementById('colorPicker');
		color.classList.toggle('colorPicker');
	};

	const handleColorChange = (color) => {
		const wrapper = document.getElementById('container');
		console.log('clicked in color');
		setbgColor(color);
		toggleColor();
		wrapper.style.backgroundColor = color.hex;
	};

	return (
		<div className="App" id="container">
			<h1>Pomodoro Timer</h1>
			<h2>
				{onBreak ? 'Break: ' : 'Work: '}
				{formatTime()}
			</h2>
			<p>{`Pomodoros Completed: ${count}`}</p>
			<div className="button-row">
				<button onClick={() => toggleColor()}>Change Color</button>

				<button onClick={() => setActive(!active)}>{active ? 'Pause' : 'Start'}</button>
			</div>
			<div id="colorPicker" className="colorPicker">
				<CirclePicker color={bgColor} onChange={(color, e) => handleColorChange(color, e)} />
			</div>
		</div>
	);
}

export default App;

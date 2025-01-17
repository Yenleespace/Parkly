import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper";

import { CarouselNextButton, CarouselPrevButton } from "./CarouselButton";
import { generateDates, getDates } from "../../store/dates";
import { createReservation } from "../../store/reservations";
import { getCurrentUser } from "../../store/session";
import AuthModal from "../Auth/AuthModal";
import DateSelector from "./DateSelector";
import DateBoxItem from "./DateBoxItem";

import "swiper/css";
import "swiper/css/navigation";
import "./Reservation.scss";
import "./CarouselButton.scss";

const Reservation = ({ spot }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const dates = useSelector(getDates(spot.date));
	const user = useSelector(getCurrentUser());

	useEffect(() => {
		dispatch(generateDates());
	}, [dispatch]);

	const [inDate, setInDate] = useState(false);
	const [outDate, setOutDate] = useState(false);
	const [selectedDates, setSelectedDates] = useState([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const handleClick = (e, date) => {
		e.preventDefault();

		if (inDate && outDate) {
			setInDate(false);
			setOutDate(false);
			const selectedDates = document.querySelectorAll(".selected-date");
			selectedDates.forEach((date) => {
				date.classList.remove("selected-date");
			});
			setSelectedDates([]);
		} else if (!inDate) {
			setInDate(true);
			e.target.classList.add("selected-date");

			setSelectedDates([...selectedDates, date]);
		} else {
			const targetDate =
				e.target.querySelector("p:nth-child(2)").innerText;
			const previousSelectedDate =
				document.querySelector(".selected-date").children[1].innerText;

			if (targetDate === previousSelectedDate) {
				setOutDate(true);
				setSelectedDates([...selectedDates, date]);
			}

			if (parseInt(targetDate) > parseInt(previousSelectedDate)) {
				setOutDate(true);
				setSelectedDates([...selectedDates, date]);
				e.target.classList.add("selected-date");

				const dateBoxes = document.querySelectorAll(".date-box-item");

				let count = 0;
				dateBoxes.forEach((dateBox) => {
					if (dateBox.classList.contains("selected-date")) {
						count++;
					}

					if (0 < count && count < 2) {
						dateBox.classList.add("selected-date");
					}
				});
			}
		}
	};

	// Handle submit button
	const handleClickSubmit = (e) => {
		e.preventDefault();
		if (endDate !== "" && startDate !== "") {
			// Create new reservation with spot object and pass it to the createReservation thunk
			// action that will make a POST request to the backend
			const newReservation = { startDate, endDate, spot };
			dispatch(createReservation(newReservation));

			// Redirect to the user profile page were they can see their new reservation
			history.push(`/users/${user._id}/`);
		}
	};

	return (
		<div className="carousel_wrapper">
			<div className="swiper-wrapper">
				<CarouselPrevButton />
				<Swiper
					className="carousel-container__swiper"
					modules={[Navigation, A11y]}
					spaceBetween={5}
					slidesPerView={5}
					navigation={{
						nextEl: ".custom-next-button",
						prevEl: ".custom-prev-button",
					}}
				>
					{dates &&
						dates.map((date, i) => {
							return (
								<SwiperSlide key={i}>
									<DateBoxItem
										date={date}
										key={i}
										onClick={handleClick}
									/>
								</SwiperSlide>
							);
						})}
				</Swiper>
				<CarouselNextButton />
			</div>

			<div className="star-end-date">
				<div className="set-date">
					<span className="bold-span">Start-date: </span>
					{inDate && (
						<div className="in-date">
							{
								<DateSelector
									selectedDate={selectedDates[0]}
									handleSelect={(e) =>
										setStartDate(selectedDates[0])
									}
									timeMarker={{
										time: spot.startTime,
										firstDate: dates[0],
										type: "start",
									}}
								/>
							}
						</div>
					)}
				</div>
				<div className="set-date">
					<span className="bold-span">End-date: </span>
					{outDate && (
						<div className="in-date">
							{
								<DateSelector
									selectedDate={selectedDates[1]}
									handleSelect={(e) =>
										setEndDate(selectedDates[1])
									}
									timeMarker={{
										time: spot.endTime,
										lastDate: dates[dates.length - 1],
										type: "end",
									}}
								/>
							}
						</div>
					)}
				</div>
				<div className="reservation-calc">
					<p>Total Reservation Price: </p>
				</div>
			</div>

			<div className="reservation-button">
				{user ? (
					<button
						disabled={!inDate || !outDate}
						type="submit"
						onClick={handleClickSubmit}
					>
						Reserve
					</button>
				) : (
					<AuthModal reservation={{ startDate, endDate, spot }} />
				)}
			</div>
		</div>
	);
};

export default Reservation;

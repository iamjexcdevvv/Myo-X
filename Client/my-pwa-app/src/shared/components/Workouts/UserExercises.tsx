import { AlarmClock, Plus, Settings2 } from "lucide-react";
import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";
import ExerciseSets from "./ExerciseSets";
import React, { useState } from "react";
import OptionMenu from "./Menu/OptionMenu";
import ExerciseOptionMenu from "./Menu/ExerciseOptionMenu";
import RestTimerOptionMenu from "./Menu/RestTimerOptionMenu";
import { formatTime } from "../../../utils/utils";

export default function UserExercises({
	exercise,
	handleAddSetClick,
	handleRemoveSetClick,
	setToggleRestTimer,
	setRestTimeLeft,
}: {
	exercise: WorkoutSessionLog;
	handleAddSetClick: (exerciseId: string) => void;
	handleRemoveSetClick: (exerciseId: string, setId: number) => void;
	setToggleRestTimer: React.Dispatch<React.SetStateAction<boolean>>;
	setRestTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}) {
	const [optionType, setOptionType] = useState<"rest" | "exercise" | null>(
		null
	);
	const [toggleMenu, setToggleMenu] = useState(false);

	const handleClick = () => {
		setOptionType("exercise");
		setToggleMenu((prev) => !prev);
	};

	return (
		<>
			<div className="collapse relative bg-base-100 border-base-300 border">
				<input type="checkbox" />
				<div className="collapse-title font-semibold space-y-3">
					<div>
						<h6>{exercise.exerciseName}</h6>
						<span className="text-xs">{`${exercise.sets.length} sets of ${exercise.repRangeStart} to ${exercise.repRangeEnd} reps`}</span>
					</div>
					<div className="relative bottom-0 left-0 z-50">
						<button
							onClick={() => {
								setToggleMenu((prev) => !prev);
								setOptionType("rest");
							}}
							className="flex space-x-1 text-sm items-center text-primary font-medium"
						>
							<AlarmClock />
							<span>{`Rest Timer: ${
								!exercise.restTimer
									? "OFF"
									: formatTime(exercise.restTimer)
							}`}</span>
						</button>
					</div>
				</div>
				<div className="collapse-content text-sm space-y-2">
					<div className="flex justify-around">
						<h6>Reps</h6>
						<h6>Load</h6>
						<h6>RIR</h6>
						<h6>Action</h6>
					</div>
					{[...Array(exercise.sets.length)].map((_, index) => (
						<ExerciseSets
							key={exercise.exerciseId + index}
							exercise={exercise}
							index={index}
							handleRemoveSetClick={handleRemoveSetClick}
							setToggleRestTimer={setToggleRestTimer}
							setRestTimeLeft={setRestTimeLeft}
						/>
					))}
					<div>
						<button
							onClick={() =>
								handleAddSetClick(exercise.exerciseId)
							}
							className="btn w-full"
						>
							<Plus />
							<span>Add Set</span>
						</button>
					</div>
				</div>
				<div className="absolute top-12 right-3 z-10">
					<div>
						<button onClick={handleClick}>
							<Settings2 />
						</button>
					</div>
				</div>
			</div>

			<OptionMenu toggleMenu={toggleMenu}>
				{optionType === "exercise" && (
					<ExerciseOptionMenu exercise={exercise} />
				)}
				{optionType === "rest" && (
					<RestTimerOptionMenu
						setToggleMenu={setToggleMenu}
						exercise={exercise}
					/>
				)}
			</OptionMenu>

			{toggleMenu && (
				<div
					onClick={() => setToggleMenu(false)}
					className="fixed w-full h-screen top-0 left-0 z-40"
				></div>
			)}
		</>
	);
}

export const getCurrentDateWithUserTimezone = () => {
	const now = new Date();

	// Get timezone offset in minutes (+480 for UTC+8, -360 for UTC-6, etc.)
	const timezoneOffsetMinutes = now.getTimezoneOffset();
	const timezoneOffsetHours = -timezoneOffsetMinutes / 60; // Convert to hours

	// Format timezone offset as "+08:00" or "-05:30"
	const offsetSign = timezoneOffsetHours >= 0 ? "+" : "-";
	const absOffsetHours = Math.abs(timezoneOffsetHours);
	const hours = Math.floor(absOffsetHours).toString().padStart(2, "0");
	const minutes = ((absOffsetHours % 1) * 60).toString().padStart(2, "0");
	const timezoneString = `${offsetSign}${hours}:${minutes}`;

	// Format date components (YYYY-MM-DDTHH:mm:ss.sss)
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const day = now.getDate().toString().padStart(2, "0");
	const hours24 = now.getHours().toString().padStart(2, "0");
	const minutesStr = now.getMinutes().toString().padStart(2, "0");
	const secondsStr = now.getSeconds().toString().padStart(2, "0");
	const millisecondsStr = now.getMilliseconds().toString().padStart(3, "0");

	// Combine into ISO-like format with local timezone
	return `${year}-${month}-${day}T${hours24}:${minutesStr}:${secondsStr}.${millisecondsStr}${timezoneString}`;
};

export const formatTime = (totalSeconds: number) => {
	if (totalSeconds === 0) return "OFF";

	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	if (minutes > 0 && seconds === 0) {
		return `${minutes}min`;
	} else if (minutes > 0) {
		return `${minutes}min ${seconds.toString().padStart(2, "0")}s`;
	}
	return `${seconds}s`;
};

export function formatToMMSS(totalSeconds: number) {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	// Format based on time duration
	if (totalSeconds >= 86400) {
		// 1 day or more (24*60*60)
		const days = Math.floor(totalSeconds / 86400);
		const remainingHours = Math.floor((totalSeconds % 86400) / 3600);
		return `${days.toString().padStart(2, "0")}:${remainingHours
			.toString()
			.padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	} else if (totalSeconds >= 3600) {
		// 1 hour or more
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	} else if (totalSeconds >= 60) {
		// 1 minute or more
		return `${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	} else {
		// Less than 1 minute
		return `${seconds.toString().padStart(2, "0")}`;
	}
}

// export const formatToMMSS = (totalSeconds: number) => {
// 	const minutes = Math.floor(totalSeconds / 60)
// 		.toString()
// 		.padStart(2, "0");
// 	const seconds = (totalSeconds % 60).toString().padStart(2, "0");
// 	return `${minutes}:${seconds}`;
// };

export const formatDate = (dateTime: string) => {
	const date = new Date(dateTime);

	const formatted = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(date);

	return formatted;
};

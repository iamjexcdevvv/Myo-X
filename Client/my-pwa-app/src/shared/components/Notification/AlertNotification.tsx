import useNotification from "../../../hooks/useNotification";
import ErrorNotification from "./ErrorNotification";
import SuccessNotification from "./SuccessNotification";

export default function AlertNotification() {
	const { currentNotification } = useNotification();

	return (
		<>
			<SuccessNotification currentNotification={currentNotification} />
			<ErrorNotification currentNotification={currentNotification} />
		</>
	);
}

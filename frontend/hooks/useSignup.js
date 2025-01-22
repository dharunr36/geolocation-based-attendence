import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);

	const {authUser,setAuthUser}= useAuthContext();
	const signup = async ({ fullname, username, password, confirmpassword, gender }) => {
		const success = handleInputErrors({ fullname, username, password, confirmpassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const res = await fetch("http://localhost:5000/api/auth/signup", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				  },
				body: JSON.stringify({ fullname, username, password, confirmpassword , gender }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
            
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullname, username, password, confirmpassword, gender }) {
	if (!fullname || !username || !password || !confirmpassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}
	//if (password !== confirmpassword) {
	//	toast.error("Passwords do not match");
	//	return false;
	//}

	//if (password.length < 6) {
	//	toast.error("Password must be at least 6 characters");
	//	return false;
	//}

	//because the error message is shown by the backend from the catch

	return true;
}
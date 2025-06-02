import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { userLogin } from "../../services/AuthService";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { saveUserAccessToken } from "../../utils/offlineAuthUtils";

const loginSchema = z.object({
	username: z.string().nonempty("Username is required"),
	password: z.string().nonempty("Password is required"),
});

type ValidationSchemaType = z.infer<typeof loginSchema>;

export default function Login() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<ValidationSchemaType>({
		resolver: zodResolver(loginSchema),
	});

	const { setIsAuthenticated } = useAuth();
	const navigate = useNavigate();

	async function onSubmit(data: ValidationSchemaType) {
		const response = await userLogin(data.username, data.password);

		if (!response.success) {
			if ("Password" in response.errors) {
				setError("password", {
					type: "server",
					message: response.errors.Password[0],
				});
			}

			if ("Username" in response.errors) {
				setError("username", {
					type: "server",
					message: response.errors.Username[0],
				});
			}
		} else {
			navigate("/dashboard");
			setIsAuthenticated(true);
			saveUserAccessToken(response.accessToken);
		}
	}

	return (
		<section className="w-full h-full flex items-center">
			<div className="mx-auto w-80 h-fit bg-neutral rounded">
				<div className="flex items-center justify-center space-x-2 p-2">
					<img className="w-10 h-10" src="/myo-x.svg" alt="myox" />
					<h1 className="text-xl font-black">Myo X</h1>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full h-full p-3 space-y-4"
				>
					<div className="space-y-2">
						<div>
							<label className="floating-label">
								<span>Username</span>
								<input
									type="text"
									placeholder="Username"
									className="input input-md"
									{...register("username")}
								/>
							</label>
							{errors.username && (
								<span className="text-error text-xs">
									{errors.username.message}
								</span>
							)}
						</div>

						<div>
							<label className="floating-label">
								<span>Password</span>
								<input
									type="password"
									placeholder="Password"
									className="input input-md"
									{...register("password")}
								/>
							</label>
							{errors.password && (
								<span className="text-error text-xs">
									{errors.password.message}
								</span>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<button
							type="submit"
							className="btn btn-outline btn-secondary w-full"
						>
							Sign In
						</button>

						<div>
							<p className="text-xs">
								Dont have an account?{" "}
								<span className="text-primary font-bold">
									<Link to="/auth/register">
										Register here
									</Link>
								</span>
							</p>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}

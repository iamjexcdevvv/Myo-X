import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { z } from "zod";
import { registerUser } from "../../services/AuthService";
import useNotification from "../../hooks/useNotification";

const registerSchema = z
	.object({
		email: z
			.string()
			.nonempty("Email is required")
			.email("Invalid email format"),
		password: z
			.string()
			.nonempty("Password is required")
			.min(8, "Password requires at least 8 characters long"),
		confirmPassword: z.string().nonempty("Confirm Password is required"),
	})
	.refine((val) => val.password === val.confirmPassword, {
		message: "Password and Confirm Password dont match",
		path: ["confirmPassword"],
	});

type ValidationSchemaType = z.infer<typeof registerSchema>;

export default function Register() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<ValidationSchemaType>({
		resolver: zodResolver(registerSchema),
	});

	const navigate = useNavigate();
	const { addNotification } = useNotification();

	async function onSubmit(data: ValidationSchemaType) {
		const response = await registerUser(
			data.email,
			data.password,
			data.confirmPassword
		);

		if (!response.success) {
			if ("Email" in response.errors) {
				setError("email", {
					type: "server",
					message: response.errors.Email[0],
				});
			}
		} else {
			navigate("/auth/login", {
				replace: true,
			});
			addNotification({
				type: "success",
				message: "Your account has been created successfully",
			});
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
								<span>Email</span>
								<input
									type="email"
									placeholder="Email"
									className="input input-md"
									{...register("email")}
								/>
							</label>
							{errors.email && (
								<span className="text-error text-xs">
									{errors.email.message}
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

						<div>
							<label className="floating-label">
								<span>Confirm Password</span>
								<input
									type="password"
									placeholder="Confirm Password"
									className="input input-md"
									{...register("confirmPassword")}
								/>
							</label>
							{errors.confirmPassword && (
								<span className="text-error text-xs">
									{errors.confirmPassword.message}
								</span>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<button
							type="submit"
							className="btn btn-outline btn-secondary w-full"
						>
							Sign Up
						</button>

						<div>
							<p className="text-xs">
								Already have an account?{" "}
								<span className="text-primary font-bold">
									<Link to="/auth/login">Login here</Link>
								</span>
							</p>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}

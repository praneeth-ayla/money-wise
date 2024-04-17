"use client";

import { useState } from "react";
import axios from "axios";

const handleSubmit = async (formData: any) => {
	const res = await axios.post("http://localhost:3001/api/auth/signup", {
		email: formData.email,
		password: formData.password,
		name: formData.name,
	});
	console.log(res);
};

export default function page() {
	const [formData, setFormData] = useState({});
	return (
		<div className="flex flex-col w-1/2 gap-10 p-32 mx-auto ">
			{JSON.stringify(formData)}
			<input
				type="text"
				placeholder="email"
				onChange={(e) => {
					setFormData({
						...FormData,
						email: e.target.value,
					});
				}}
				className="border-2 border-black"
			/>
			<input
				type="text"
				placeholder="name"
				onChange={(e) => {
					setFormData({
						...formData,
						name: e.target.value,
					});
				}}
				className="border-2 border-black"
			/>
			<input
				type="password"
				placeholder="password"
				onChange={(e) => {
					setFormData({
						...formData,
						password: e.target.value,
					});
				}}
				className="border-2 border-black"
			/>
			<button
				onClick={() => {
					handleSubmit(formData);
				}}
				type="submit"
				value="submit"
				className="border-2 border-black">
				submit
			</button>
		</div>
	);
}

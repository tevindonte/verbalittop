import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerUser = async () => {
    if (password === confirmPassword) {
      const userObj = {
        name,
        password,
        email,
        confirmPassword,
      };
      try {
        toast.loading("Loading...");
        const response = await axios.post("https://verbalitserver.onrender.com/api/auth/register", userObj);
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Something went wrong register");
      }
    } else {
      toast.error("Passwords Not Matched");
    }
  };

  return (
    <div>
    <div className="bg-[#080606] font-SecularOne flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0">
        <div>

        </div>
        <div className="w-full bg-[#D02530] border-2 border-[#FEAB1D] px-6 py-4 mt-6 overflow-hidden shadow-md sm:max-w-lg sm:rounded-lg">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white undefined"
                    >
                        Username
                    </label>
                    <div className="flex flex-col items-start">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            className="pl-2 block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white undefined"
                    >
                        Email
                    </label>
                    <div className="flex flex-col items-start">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={(e)=>setEmail(e.target.value)}
                            value={email}
                            required
                            className="pl-2 block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-white undefined"
                    >
                        Password
                    </label>
                    <div className="flex flex-col items-start">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                            required
                            className="pl-2 block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-medium text-white undefined"
                    >
                        Confirm Password
                    </label>
                    <div className="flex flex-col items-start">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                            className="pl-2 block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <button className="w-full px-4 py-2 tracking-wide text-black transition-colors duration-200 transform bg-[#FEAB1D] rounded-md hover:bg-[#F5F5F7] focus:outline-none focus:bg-black" onClick={registerUser}>
                        Register
                    </button>
                </div>
            <div className='pt-3 hover:underline text-white flex text-sm justify-center items-center'>
              <a>Already have an account?</a>
              </div>
            <div className="py-4 items-center justify-center">
            <Link to ="/login">
              <button className="w-full px-4 py-2 tracking-wide text-black transition-colors duration-200 transform bg-[#F5F5F7] rounded-md hover:bg-[#CDDBFE] focus:outline-none focus:bg-black">
                        Log in
                    </button>
                    </Link>
            </div>


        </div>
    </div>
</div>
  );
}

export default Register;

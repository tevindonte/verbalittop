import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const resetPassword = async () => {
    try {
      toast.loading();
      const response = await axios.post("https://verbalitserver.onrender.com/api/auth/reset-password", {
        password,
        token: params.token,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error("Expired or Invalid Link");
      }
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong reset");
    }
  };

  return (
    <div className="bg-[#080606] font-SecularOne flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0">
      <div className="w-full bg-[#D02530] border-2 border-[#FEAB1D] px-6 py-4 mt-6 overflow-hidden shadow-md sm:max-w-lg sm:rounded-lg">


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
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                            value={confirmpassword}
                            required
                            className="pl-2 block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>

        <div className="flex justify-center py-2 items-center">
          <button
            className="py-1 px-5  text-white bg-black rounded-md"
            onClick={resetPassword}
          >
            RESET PASSWORD
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

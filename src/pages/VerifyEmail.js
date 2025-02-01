import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

function VerifyEmail() {
  const [emailVerified, setEmailVerified] = useState("");
  const params = useParams();

  const verifyToken = async () => {
    try {
      toast.loading("Verifying email...");
      const response = await axios.post(
        "http://localhost:5000/api/auth/verifyemail",
        { token: params.token } // Pass the token in the request body
      );

      if (response.data.success) {
        setEmailVerified("true");
        toast.success("Email verified successfully!");
      } else {
        setEmailVerified("false");
        toast.error(response.data.message || "Invalid or expired token");
      }
    } catch (error) {
      setEmailVerified("false");
      toast.error("An error occurred while verifying email");
    }
  };

  useEffect(() => {
    verifyToken();
  }, [params.token]);

  return (
    <div className="flex min-h-screen p-5 justify-center items-center">
      {emailVerified === "" && (
        <h1 className="text-primary text-4xl">
          Please wait, we are verifying your email
        </h1>
      )}
      {emailVerified === "true" && (
        <h1 className="text-primary text-4xl">
          Your email has been verified successfully
        </h1>
      )}
      {emailVerified === "false" && (
        <h1 className="text-primary text-4xl">Invalid or expired token</h1>
      )}
    </div>
  );
}

export default VerifyEmail;

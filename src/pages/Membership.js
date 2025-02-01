import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/NavMemb";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext


export default function Membership () {

  const [userInfo, setUserInfo] = useState(null);
  const { user, loading } = useContext(AuthContext); // Access user and loading state from AuthContext

  


  const tiers = [
    // Monthly Plans
    {
      name: "Freemium",
      price: "0",
      period: "month",
      features: [
        "Up to 5 projects",
        "Basic note-taking functionality",
        "Basic moodboarding (limited templates)",
        "30 minutes TTS/day",
        "Watermarked exports",
        "10 minutes STT/day",
        "Share and collaborate on project space",
        "Share tasks in Calendar",
        "Share notebook pages",
        "Share moodboard"
      ],
      checkoutLink: null,
    },
    {
      name: "Basic",
      price: "15",
      period: "month",
      inheritsFrom: "Freemium",
      features: [
        "Up to 10 projects",
        "500MB storage per project",
        "Advanced note-taking features",
        "Full moodboarding features (no watermarks)",
        "Up to 600,000 characters TTS/month",
        "Up to 5 hours STT/month",
        "20 minutes STT/day",
        "Enhanced task sharing and integration in Calendar",
        "10 upgraded standard voices",
        "TTS speed up to 1.5x",
      ],
      checkoutLink: "https://buy.stripe.com/28o3fy9PH6gn47edQQ",
    },
    {
      name: "Premium",
      price: "29",
      period: "month",
      inheritsFrom: "Basic",
      features: [
        "Up to 30 projects",
        "1.5GB storage per project",
        "Unlimited projects",
        "Full access to all features",
        "Priority support",
        "Customizable layouts",
        "Up to 1,000,000 characters TTS/month",
        "Up to 8 hours STT/month",
        "60 minutes STT/day",
        "All available voices, including premium ones",
        "TTS speed up to 2.5x",
        "Advanced collaboration tools",
        "Full integration and advanced task management in Calendar",
      ],
      checkoutLink: "https://buy.stripe.com/7sI5nG6Dv8oveLS001",
    },
    // Yearly Plans
    {
      name: "Basic Yearly",
      price: "150",
      period: "year",
      inheritsFrom: "Basic",
      features: ["Save 20% with yearly billing"],
      checkoutLink: "https://buy.stripe.com/5kAcQ87HzawDcDKcMO",
    },
    {
      name: "Premium Yearly",
      price: "290",
      period: "year",
      inheritsFrom: "Premium",
      features: ["Save 20% with yearly billing"],
      checkoutLink: "https://buy.stripe.com/4gwdUcge5cEL33afZ1",
    },
  ];

  

  // Extract user details from AuthContext
  const userId = user?._id;
  // Ensure userId is properly derived
  const userEmail = userInfo?.email;
  const userName = userInfo?.name;


  const [subscriptionId, setSubscriptionId] = useState(""); // Initialize as empty string
 
  useEffect(() => {
    const fetchSubscriptionId = async () => {
      if (!userId) return; // Ensure userId is present
  
      try {
        const response = await fetch(`/get-subscription?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription. Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setSubscriptionId(data.subscriptionId);
        } else {
          console.error("Failed to fetch subscription ID:", data.message);
        }
      } catch (error) {
        console.error("Error fetching subscription ID:", error);
      }
    };
  
    // Fetch only if userId is available
    fetchSubscriptionId(subscriptionId);
  }, [userId]);


  const handleCheckout = async (checkoutLink, priceId) => {
  try {
    if (checkoutLink) {
      // Redirect to Payment Link
      window.location.href = `${checkoutLink}?client_reference_id=${userId}&user_email=${encodeURIComponent(
        userEmail
      )}&user_name=${encodeURIComponent(userName)}`;
    } else {
      // Dynamic Checkout Session
      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, priceId, userEmail, userName }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create a checkout session:", data.error);
      }
    }
  } catch (error) {
    console.error("Error during checkout:", error);
  }
};


  const cancelSubscription = async (subscriptionId) => {
    try {
      const response = await fetch("/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Subscription canceled successfully!");
        setSubscriptionId(""); // Clear subscription ID from UI
      } else {
        alert("Failed to cancel subscription: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while canceling the subscription.");
    }
  };

  const renderFeatures = (tier) => {
    const features = [];

    // If the tier inherits from another, add an "Includes all features from [previous tier]" statement
    if (tier.inheritsFrom) {
      features.push(
        <li key="inherit" className="flex items-center">
          <svg
            className="flex-shrink-0 w-5 h-5 text-blue-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="ms-3 text-base font-normal text-gray-700">
            Includes all features from {tier.inheritsFrom}
          </span>
        </li>
      );
    }

    // Add unique features
    tier.features.forEach((feature, idx) => {
      features.push(
        <li key={idx} className="flex items-center">
          <svg
            className="flex-shrink-0 w-5 h-5 text-blue-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="ms-3 text-base font-normal text-gray-700">
            {feature}
          </span>
        </li>
      );
    });

    return features;
  };

  return (
    <div>
<Nav userId={userId} />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">
          Verbal-it Membership Plans
        </h1>

        {/* Monthly Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {tiers
            .filter((tier) => tier.period === "month")
            .map((tier) => (
              <div
                key={tier.name}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h5 className="mb-4 text-xl font-medium text-gray-800">
                    {tier.name}
                  </h5>
                  <div className="flex items-baseline text-gray-900">
                    <span className="text-3xl font-semibold">$</span>
                    <span className="text-5xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="ms-1 text-xl font-normal text-gray-500">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-3 my-6">
                    {renderFeatures(tier)}
                  </ul>
                </div>
                <button
                  onClick={() =>
                    handleCheckout(tier.checkoutLink, tier.priceId) // Add dynamic `priceId` if needed
                  }
                  className="mt-4 w-full px-5 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none inline-block text-center"
                >
                  Choose Plan
                </button>
              </div>
            ))}
        </div>

        {/* Yearly Plans and Cancel Subscription */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yearly Plans */}
          {tiers
            .filter((tier) => tier.period === "year")
            .map((tier) => (
              <div
                key={tier.name}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h5 className="mb-4 text-xl font-medium text-gray-800">
                    {tier.name}
                  </h5>
                  <div className="flex items-baseline text-gray-900">
                    <span className="text-3xl font-semibold">$</span>
                    <span className="text-5xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="ms-1 text-xl font-normal text-gray-500">
                      /year
                    </span>
                  </div>
                  <ul className="space-y-3 my-6">
                    {renderFeatures(tier)}
                  </ul>
                </div>
                <button
                  onClick={() =>
                    handleCheckout(tier.checkoutLink, tier.priceId) // Add dynamic `priceId` if needed
                  }
                  className="mt-4 w-full px-5 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none inline-block text-center"
                >
                  Choose Plan
                </button>
              </div>
            ))}

          {/* Cancel Subscription Section */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <h5 className="mb-4 text-xl font-medium text-gray-800">
                Cancel Membership
              </h5>
              <p className="text-gray-700 mb-4">
                If you wish to cancel your current subscription, click the button
                below. This action is irreversible, and you'll lose access to premium features.
              </p>
            </div>
            <button
              onClick={() => cancelSubscription(subscriptionId)}
              className="mt-4 w-full px-5 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

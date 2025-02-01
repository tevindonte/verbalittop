import React from "react";

export default function Cards() {
  return (
    <div className="relative z-10 container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-6xl md:text-8xl xl:text-10xl font-bold font-heading tracking-tight leading-none font-SecularOne text-[#D02530]">
          Select your plan!
        </h2>
        <p className="mt-6 text-lg font-SecularOne text-white">
          Upgrading your plan unlocks the full power of Verbalit, including advanced tools for
          note-taking, moodboarding, and text-to-speech. Choose the plan that fits your goals and
          start transforming your creativity today!
        </p>
      </div>

      <div className="flex flex-wrap justify-center -mx-4">
        {/* Freemium Plan */}
        <div className="w-full md:w-1/3 px-4 mb-8">
          <div className="bg-black rounded-3xl shadow-lg p-6 border-t-4 border-[#FEAB1D]">
            <h3 className="text-2xl font-bold text-[#FEAB1D] font-SecularOne mb-4">Freemium</h3>
            <p className="text-5xl font-BluuSuperstar text-white mb-2">$0</p>
            <p className="text-md text-gray-300 font-SecularOne mb-6">/month</p>
            <ul className="mb-6 space-y-3 text-white font-SecularOne">
              <li>Up to 5 projects</li>
              <li>Basic note-taking functionality</li>
              <li>Basic moodboarding (limited templates)</li>
              <li>10 minutes TTS/month</li>
              <li>Watermarked exports</li>
            </ul>
            <button className="w-full py-4 bg-[#FEAB1D] text-black rounded-xl font-medium font-SecularOne hover:bg-green-600 transition duration-200">
              Choose Plan
            </button>
          </div>
        </div>

        {/* Basic Plan */}
        <div className="w-full md:w-1/3 px-4 mb-8">
          <div className="bg-black rounded-3xl shadow-lg p-6 border-t-4 border-[#FEAB1D]">
            <h3 className="text-2xl font-bold text-[#FEAB1D] font-SecularOne mb-4">Basic Paid Tier</h3>
            <p className="text-5xl font-BluuSuperstar text-white mb-2">$15</p>
            <p className="text-md text-gray-300 font-SecularOne mb-6">/month</p>
            <ul className="mb-6 space-y-3 text-white font-SecularOne">
              <li>Up to 20 projects</li>
              <li>Advanced note-taking features</li>
              <li>Full moodboarding features</li>
              <li>1 hour TTS/month</li>
              <li>No watermarks</li>
            </ul>
            <button className="w-full py-4 bg-[#FEAB1D] text-black rounded-xl font-medium font-SecularOne hover:bg-green-600 transition duration-200">
              Choose Plan
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="w-full md:w-1/3 px-4 mb-8">
          <div className="bg-black rounded-3xl shadow-lg p-6 border-t-4 border-[#FEAB1D]">
            <h3 className="text-2xl font-bold text-[#FEAB1D] font-SecularOne mb-4">Premium Paid Tier</h3>
            <p className="text-5xl font-BluuSuperstar text-white mb-2">$29</p>
            <p className="text-md text-gray-300 font-SecularOne mb-6">/month</p>
            <ul className="mb-6 space-y-3 text-white font-SecularOne">
              <li>Unlimited projects</li>
              <li>Full access to all features</li>
              <li>Priority support</li>
              <li>Customizable layouts</li>
              <li>Unlimited TTS usage</li>
            </ul>
            <button className="w-full py-4 bg-[#FEAB1D] text-black rounded-xl font-medium font-SecularOne hover:bg-green-600 transition duration-200">
              Choose Plan
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-white font-SecularOne">
          Save 20% with our yearly plans! 
        </p>
      </div>
    </div>
  );
}

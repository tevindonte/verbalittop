import React from 'react'
import {useRef} from "react"
import emailjs from '@emailjs/browser';
import toast from "react-hot-toast";
export default function Contact() {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_vgyoj34', 'template_hdsu8ah', form.current, 'jotr409kT_CXo9Cnf')
      .then((result) => {
          console.log(result.text);
          console.log("message sent")
          toast('Message sent!')
      }, (error) => {
          console.log(error.text);
          console.log("error message not sent")
          toast('Error message not sent!')
      });
  };
  return (
    <div name='contact'>
    <section className="text-gray-700 body-font relative">
      <form ref={form} onSubmit={sendEmail}>
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 font-BluuSuperstar text-[#D02530]">
            Contact Us
          </h1>
          <p className="text-[#f3f6fc] lg:w-2/3 mx-auto leading-relaxed text-base font-SecularOne">
            Need to get in touch with us? Fill out the form with your inquiry and we will reach out to you shortly!
          </p>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-1/2">
              <div className="relative">
                <label for="name" className="leading-7 text-sm text-white font-SecularOne">
                  Name
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label
                  for="email"
                  className="leading-7 text-sm text-white font-SecularOne"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  className="w-full bg-gray-100 rounded border font- border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-full">
              <div className="relative">
                <label
                  for="message"
                  className="leading-7 text-sm text-white font-SecularOne"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                ></textarea>
              </div>
            </div>
            <div className="p-2 w-full flex flex-auto mx-auto justify-center items-center">
            <button type="submit" class="flex justify-center items-center font-SecularOne text-black bg-gradient-to-br from-[#D02530] to-[#FFB41F] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-1 mb-2" >Message</button>
            </div>
            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
            <a href="mailto:verbalitapp@gmail.com" class="text-[#D02530] font-SecularOne dark:text-white hover:underline">verbalitapp@gmail.com</a>            </div>
          </div>
        </div>
      </div>
      </form>
    </section>
  </div>
  )
}
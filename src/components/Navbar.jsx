import React, {useState} from 'react'
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'
import { Link as routelink, NavLink, BrowserRouter} from 'react-router-dom'
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import signup from '../pages/Register'
import history from './history/history.jsx';



export default function Navbar() {
    function signupmover() {
        history.push('/register');
        history.go(0);
    }
    function loginmover() {
        history.push('/login');
        history.go(0);
    }
    const [nav, setNav] = useState(true)
    const handleNav = () => {
        setNav(!nav)
    }
    

  return (
    <div className='font-SecularOne text-sm flex justify-between items-center h-24 max-w-[1440px] mx-auto px-4 text-[#f3f6fc] '>
        <a href = "#"><img src={require('../verbalitlogo/whitelogo.png')}  width="55" height="55" className=''/></a>
        <ul className='hidden md:flex p-4'>
        <li className='p-4 hover:underline  '><Link to="home" smooth={true} offset={50} duration={500}>Home</Link></li>
        <li className='p-4 hover:underline '><Link to="testimony" smooth={true} offset={50} duration={500}>Testimony</Link></li>
        <li className='p-4 hover:underline '><Link to="pricing" smooth={true} offset={50} duration={500}>Pricing</Link></li>
        <li className='p-4 hover:underline '><Link to="contact" smooth={true} offset={50} duration={500}>Contact</Link></li>

 
            <div className='flex'>
            <button  onClick={loginmover} class="relative inline-flex items-center justify-center p-0.2 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-[#D02530] to-[#FFB41F] group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
            
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#080606] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Sign in
            </span>
            </button>
            <button type="button"  onClick={signupmover} class="text-black border border-yellow-500 bg-gradient-to-br from-[#D02530] to-[#FFB41F] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200	 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-1 mb-2">Sign up</button>
        </div>
        </ul>

        <div onClick={handleNav} className='block md:hidden'>
            {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
    <div className={!nav ? 'fixed left-0 top-0 w[60%] h-full border-r border-r-gray-900 bg-[#080606] ease-in-out duration-500' : 'fixed left-[-100%]'}>
            <img src={require('../verbalitlogo/VictoryPath.png')}  width="140" height="140" className='mx-auto'/>
            <ul className='p-4'>

                <li className='p-4 hover:underline border-b border-gray-600'><Link to="home" smooth={true} offset={50} duration={500}>Home</Link></li>
        <li className='p-4 hover:underline border-b border-gray-600'><Link to="testimony" smooth={true} offset={50} duration={500}>Testimony</Link></li>
        <li className='p-4 hover:underline border-b border-gray-600'><Link to="pricing" smooth={true} offset={50} duration={500}>Pricing</Link></li>
        <li className='p-4 hover:underline'><Link to="contact" smooth={true} offset={50} duration={500}>Contact</Link></li>
                <div className='flex'>
            <button onClick={loginmover}  class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-[#D02530] to-[#FFB41F] group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
            <span class="font-GT relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#080606] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Sign in
            </span>
            </button>

            <button type="button"  onClick={signupmover}  class="text-black bg-gradient-to-br border-yellow-500 from-[#D02530] to-[#FFB41F] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-1 mb-2">
                    Sign Up
            </button>
        </div>
            </ul>
        </div>
    </div>

  )
}
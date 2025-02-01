import React from 'react'
import nfound from '../images/nfound.png'


export default function Notfound() {
  return (
  
    <div className='bg-[#080606] font-BluuSuperstar grid h-screen place-items-center max-w-[1920px] '>
      <div className='grid  place-items-center'>
      <h1 className='text-white text-[100px]'>404</h1>
      <div className='flex justify-center items-center'>
        
        <h1 className='text-white text-4xl'>Aaaaah! Something went wrong</h1>
      </div>
      <div>
      <p className='text-white'>We couldn't find what you searched for.</p>
      </div>
    
      </div>
    </div>
  )
}
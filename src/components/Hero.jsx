import { Button } from 'flowbite-react';
import React from 'react';
import Typed from 'react-typed';
import { Link } from 'react-router-dom';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 3]);

  return (
    <div name="home" className="text-white">
      <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <p className="font-SecularOne text-[#FFB41F] font-xl p-2">
        Turn Your Ideas Into Bright, Creative Realities!
        </p>

        <motion.div
          className="font-BluuSuperstar md:text-7xl sm:text-6xl text-4xl font-bold md:py-6"
          style={{ x, scale }}
        >
          Streamline Your Creativity in One Platform.
        </motion.div>

        <div className="flex justify-center items-center">
          <p className="text-[#FFB41F] md:text-5xl sm:text-4xl text-xl font-bold font-BluuSuperstar">
            Designed for
          </p>
          <Typed
            className="text-[#D02530] md:text-5xl sm:text-4xl text-xl font-bold font-BluuSuperstar md:pl-4 pl-2"
            strings={[
              'Creatives',
              'Creators',
              'Teams',
              'Students',
              'Accessibility',
              'Collaboration',
            ]}
            typeSpeed={120}
            backSpeed={130}
            loop
          />
        </div>

        <p className="md:text-md py-3 text-md font-sm mx font-SecularOne">
        Discover the Ultimate Hub for Creativity and Productivity!
        </p>

        <Link to="/register">
          <Button className="font-SecularOne bg-gradient-to-br from-[#D02530] to-[#FFB41F] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 w-[200px] rounded-md font-medium my-2 mx-auto py-2.5 text-[#000000]">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

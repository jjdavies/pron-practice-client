'use client';
import React, { useContext, useEffect } from 'react';
import mainStyle from '../../styles/Main.module.css';

import Tick from '../../img/tick.webp';
import Image from 'next/image';

import { motion } from 'framer-motion';
import DataContext from '../../data/DataContext';

export default function Page() {
  const { currentSession, uploadSessionData } =
    useContext(DataContext);
  useEffect(() => {
    uploadSessionData();
  }, []);
  return (
    <div className={mainStyle.main}>
      <motion.div
        className={mainStyle.banner}
        initial={{ x: -100, y: 150 }}
        animate={{ x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Image
          className={mainStyle.tick}
          src={Tick}
          alt="success image"
        />
        Complete!
      </motion.div>
    </div>
  );
}

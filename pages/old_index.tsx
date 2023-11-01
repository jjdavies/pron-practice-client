import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import menuStyle from '../styles/Menu.module.css';
import React, { useState } from 'react';

export default function Home() {
  const [slide, setSlide] = useState(false);
  const slideMenuStyle = {
    transform: slide ? 'translateX(0)' : 'translateX(-100%)',
  };
  return (
    <>
      {/* <Head>
        <title>Pronunciation and Listening Practice</title>
        <meta
          name="description"
          content="Jon-James Davies - Keyword OCT Park Center"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <div className="main">
        <div className={menuStyle.sideMenuContainer}>
          <div className={menuStyle.nav}>
            <div className={menuStyle.navItem}>New Exercise</div>
            <div className={menuStyle.navItem}>
              Prepared Exercises
            </div>
            <div className={menuStyle.navItem}>
              Completed Sessions
            </div>
          </div>
        </div>
        <div
          className={menuStyle.sideMenuSlide}
          style={slideMenuStyle}
        >
          <div
            className={menuStyle.button}
            onClick={() => setSlide((s) => !s)}
          >
            <div className={menuStyle.triangleLeft}></div>
          </div>
          <div className={menuStyle.nav}>
            <div className={menuStyle.navItem}>New Exercise</div>
            <link to<div className={menuStyle.navItem}>
              Prepared Exercises
            </div>
            <div className={menuStyle.navItem}>
              Completed Sessions
            </div>
          </div>
        </div>
        <div
          className={menuStyle.button}
          onClick={() => setSlide((s) => !s)}
        >
          <div className={menuStyle.bar1}></div>
          <div className={menuStyle.bar2}></div>
          <div className={menuStyle.bar3}></div>
        </div>
      </div>
    </>
  );
}

'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import menuStyle from '../styles/Menu.module.css';
import '../styles/globals.css';
import React, { useState } from 'react';

export const metadata: Metadata = {
  title: 'My Page Title',
};

export default function Page() {
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
      <div className="main"></div>
    </>
  );
}

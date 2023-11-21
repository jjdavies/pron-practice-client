'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { useContext, useState } from 'react';
import menuStyle from '../styles/Menu.module.css';
import mainStyle from '../styles/Main.module.css';

import DataContext, { DataProvider } from '../data/DataContext';

import BlankAvatarImage from '../img/blankavatar.jpg';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

class CurrentUserProps {}

const CurrentUser = (props: CurrentUserProps) => {
  const { currentUser, userThumbs, clearUser } =
    useContext(DataContext);
  const user = userThumbs.filter(
    (user) => user.uuid === currentUser
  )[0];

  return (
    <>
      {user && (
        <div
          className={mainStyle.userAvatar}
          style={{ width: '100%' }}
        >
          <div style={{ fontFamily: 'Arial' }}>Current user:</div>
          <Image
            src={
              user.thumb !== ''
                ? '/file/' + user.thumb
                : BlankAvatarImage
            }
            width={120}
            height={120}
            alt="user avatar"
          />
          <div className={mainStyle.userName}>{user.name}</div>
          <div
            className={mainStyle.crossDelete}
            onClick={() => clearUser}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                width: '3px',
                background: 'gray',
                borderRadius: '2px',
                height: '40px',
                transform: 'rotate(45deg)',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                width: '3px',
                background: 'gray',
                borderRadius: '2px',
                height: '40px',
                transform: 'rotate(-45deg)',
              }}
            ></div>
          </div>
        </div>
      )}
      {/* {userThumbs.map((user) => (
        <div className={mainStyle.userAvatar} key={user.uuid}>
          {
            <>
              <Image
                src={
                  user.thumb !== ''
                    ? '/file/' + user.thumb
                    : BlankAvatarImage
                }
                width={180}
                height={180}
                alt="user avatar"
              />
              <div className={mainStyle.userName}>{user.name}</div>
            </>
          }
        </div>
      ))} */}
    </>
  );
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const [slide, setSlide] = useState(false);
  const slideMenuStyle = {
    transform: slide ? 'translateX(0)' : 'translateX(-100%)',
  };
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <div className={mainStyle.container}>
            <section>
              <div className={menuStyle.sideMenuContainer}>
                <div className={menuStyle.nav}>
                  <Link
                    href="/new"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <div className={menuStyle.navItem}>
                      New Exercises
                    </div>
                  </Link>
                  <Link
                    href="/prepared"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <div className={menuStyle.navItem}>
                      Prepared Exercises
                    </div>
                  </Link>
                  <Link
                    href="/completed"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <div className={menuStyle.navItem}>
                      Completed Sessions
                    </div>
                  </Link>
                  <Link
                    href="/users"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <div className={menuStyle.navItem}>
                      Manage Users
                    </div>
                  </Link>
                  <CurrentUser />
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
                  <div className={menuStyle.navItem}>
                    New Exercise
                  </div>
                  <div className={menuStyle.navItem}>
                    Prepared Exercises
                  </div>
                  <div className={menuStyle.navItem}>
                    Completed Sessions
                  </div>
                  <CurrentUser />
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
            </section>

            <section>{children}</section>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}

import { Affix, Dropdown, Menu } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import storage from '../../lib/services/storage';

const SignIn = styled.li`
  @media screen and (min-width: 700px) {
    position: fixed;
    right: 6em;
  }
`;

export default function Header() {
  const router = useRouter();
  const isEvents = router.pathname.match(/events/i);
  const isGallery = router.pathname.match(/gallery/i);
  const isLogin = router.pathname.match(/login/i);
  const isSignUp = router.pathname.match(/signup/i);
  const foreDark = isLogin || isSignUp;
  const dark = 'dark-header';
  const light = 'light-header';

  return (
    <>
      <Head>
        <link href="/style.css" type="text/css" rel="stylesheet"></link>
      </Head>

      <Affix
        offsetTop={0}
        onChange={(fixed) => {
          if (foreDark) {
            return;
          }

          const ele = document.getElementById('header');

          if (!fixed) {
            ele.className = ele.className.replace(dark, light);
          } else {
            ele.className = ele.className.replace(light, dark);
          }
        }}
      >
        <header id="header" className={foreDark ? dark : light}>
          <div className="container">
            <Link href="/">
              <span id="logo" />
            </Link>

            {/* mobile trigger menu */}
            <Dropdown
              trigger={['click']}
              className="menu-trigger"
              overlay={
                <Menu style={{ fontFamily: 'BebasNeue' }} selectedKeys={[router.pathname.slice(1)]}>
                  <Menu.Item key="events">
                    <Link href="/events">Courses</Link>
                  </Menu.Item>
                  <Menu.Item key="events2">
                    <Link href="/events">Events</Link>
                  </Menu.Item>
                  <Menu.Item key="gallery">
                    <Link href="/gallery">Students</Link>
                  </Menu.Item>
                  <Menu.Item key="gallery2">
                    <Link href="/gallery">Teachers</Link>
                  </Menu.Item>
                  <Menu.Item key="login">
                    <Link href="/login">Sign in</Link>
                  </Menu.Item>
                </Menu>
              }
            >
              <span></span>
            </Dropdown>

            <nav id="menu">
              <ul>
                <li className={isEvents ? 'current' : ''}>
                  <Link href="/events">Courses</Link>
                </li>
                <li>
                  <Link href="/events">Events</Link>
                </li>
              </ul>
              <ul>
                <li className={isGallery ? 'current' : ''}>
                  <Link href="/gallery">Students</Link>
                </li>
                <li>
                  <Link href="/gallery">Teachers</Link>
                </li>
                <SignIn className={isLogin ? 'current' : ''}>
                  {!!storage?.userInfo ? (
                    <Link href={`/dashboard/${storage?.userInfo.role}`}>Dashboard</Link>
                  ) : (
                    <Link href="/login">Sign in</Link>
                  )}
                </SignIn>
              </ul>
            </nav>
          </div>
        </header>
      </Affix>
    </>
  );
}

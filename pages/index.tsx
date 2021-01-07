import { Carousel } from 'antd';
import Head from 'next/head';
import React from 'react';
import Header from '../components/home/header';

export default function Home() {
  return (
    <>
      <Head>
        <title>Course Manger System</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script src="/js/jquery-1.11.1.min.js" key="jq"></script>
        <script src="/js/main.js" key="main"></script>
      </Head>

      <Header></Header>

      <div className="slider">
        <ul className="bxslider">
          <Carousel autoplay>
            <li>
              <div className="container">
                <div className="info">
                  <h2>
                    It’s Time to <br />
                    <span>Get back to school</span>
                  </h2>
                  <a href="#">Check out our new programs</a>
                </div>
              </div>
            </li>
            <li>
              <div className="container">
                <div className="info">
                  <h2>
                    It’s Time to <br />
                    <span>Get back to school</span>
                  </h2>
                  <a href="#">Check out our new programs</a>
                </div>
              </div>
            </li>
            <li>
              <div className="container">
                <div className="info">
                  <h2>
                    It’s Time to <br />
                    <span>Get back to school</span>
                  </h2>
                  <a href="#">Check out our new programs</a>
                </div>
              </div>
            </li>
          </Carousel>
        </ul>
        <div className="bg-bottom"></div>
      </div>

      <section className="posts">
        <div className="container">
          <article>
            <div className="pic">
              <img width="121" src="images/2.png" alt="" />
            </div>
            <div className="info">
              <h3>The best learning methods</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                veritatis quasi architecto beatae vitae dicta sunt explicabo.{' '}
              </p>
            </div>
          </article>
          <article>
            <div className="pic">
              <img width="121" src="images/3.png" alt="" />
            </div>
            <div className="info">
              <h3>Awesome results of our students</h3>
              <p>
                Vero eos et accusamus et iusto odio dignissimos ducimus blanditiis praesentium
                voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
                occaecati cupiditate non provident, similique sunt in culpa.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="news">
        <div className="container">
          <h2>Latest news</h2>
          <article>
            <div className="pic">
              <img src="images/1.png" alt="" />
            </div>
            <div className="info">
              <h4>Omnis iste natus error sit voluptatem accusantium </h4>
              <p className="date">14 APR 2014, Jason Bang</p>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores (...)
              </p>
              <a className="more" href="#">
                Read more
              </a>
            </div>
          </article>
          <article>
            <div className="pic">
              <img src="images/1_1.png" alt="" />
            </div>
            <div className="info">
              <h4>Omnis iste natus error sit voluptatem accusantium </h4>
              <p className="date">14 APR 2014, Jason Bang</p>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores (...)
              </p>
              <a className="more" href="#">
                Read more
              </a>
            </div>
          </article>
          <div className="btn-holder">
            <a className="btn" href="#">
              See archival news
            </a>
          </div>
        </div>
      </section>

      <section className="events">
        <div className="container">
          <h2>Upcoming events</h2>
          <article>
            <div className="current-date">
              <p>April</p>
              <p className="date">15</p>
            </div>
            <div className="info">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <a className="more" href="#">
                Read more
              </a>
            </div>
          </article>
          <article>
            <div className="current-date">
              <p>April</p>
              <p className="date">17</p>
            </div>
            <div className="info">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <a className="more" href="#">
                Read more
              </a>
            </div>
          </article>
          <article>
            <div className="current-date">
              <p>April</p>
              <p className="date">25</p>
            </div>
            <div className="info">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <a className="more" href="#">
                Read more
              </a>
            </div>
          </article>
          <article>
            <div className="current-date">
              <p>April</p>
              <p className="date">29</p>
            </div>
            <div className="info">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad.
              </p>
              <a className="more" href="#">
                Read more
              </a>
            </div>
          </article>
          <div className="btn-holder">
            <a className="btn blue" href="#">
              See all upcoming events
            </a>
          </div>
        </div>
      </section>
      <div className="container">
        <a href="#fancy" className="info-request">
          <span className="holder">
            <span className="title">Request information</span>
            <span className="text">
              Do you have some questions? Fill the form and get an answer!
            </span>
          </span>
          <span className="arrow"></span>
        </a>
      </div>

      <footer id="footer">
        <div className="container">
          <section>
            <article className="col-1">
              <h3>Contact</h3>
              <ul>
                <li className="address">
                  <a href="#">
                    151 W Adams St
                    <br />
                    Detroit, MI 48226
                  </a>
                </li>
                <li className="mail">
                  <a href="#">contact@harrisonuniversity.com</a>
                </li>
                <li className="phone last">
                  <a href="#">(971) 536 845 924</a>
                </li>
              </ul>
            </article>
            <article className="col-2">
              <h3>Forum topics</h3>
              <ul>
                <li>
                  <a href="#">Omnis iste natus error sit</a>
                </li>
                <li>
                  <a href="#">Nam libero tempore cum soluta</a>
                </li>
                <li>
                  <a href="#">Totam rem aperiam eaque </a>
                </li>
                <li>
                  <a href="#">Ipsa quae ab illo inventore veritatis </a>
                </li>
                <li className="last">
                  <a href="#">Architecto beatae vitae dicta sunt </a>
                </li>
              </ul>
            </article>
            <article className="col-3">
              <h3>Social media</h3>
              <p>Temporibus autem quibusdam et aut debitis aut rerum necessitatibus saepe.</p>
              <ul>
                <li className="facebook">
                  <a href="#">Facebook</a>
                </li>
                <li className="google-plus">
                  <a href="#">Google+</a>
                </li>
                <li className="twitter">
                  <a href="#">Twitter</a>
                </li>
                <li className="pinterest">
                  <a href="#">Pinterest</a>
                </li>
              </ul>
            </article>
            <article className="col-4">
              <h3>Newsletter</h3>
              <p>Assumenda est omnis dolor repellendus temporibus autem quibusdam.</p>
              <form action="#">
                <input placeholder="Email address..." type="text" />
                <button type="submit">Subscribe</button>
              </form>
              <ul>
                <li>
                  <a href="#"></a>
                </li>
              </ul>
            </article>
          </section>
          <p className="copy">
            Copyright 2014 Harrison High School. Designed by{' '}
            <a
              href="http://www.vandelaydesign.com/"
              title="Designed by Vandelay Design"
              target="_blank"
            >
              Vandelay Design
            </a>
            . All rights reserved.
          </p>
        </div>
      </footer>

      <div id="fancy">
        <h2>Request information</h2>
        <form action="#">
          <div className="left">
            <fieldset className="mail">
              <input placeholder="Email address..." type="text" />
            </fieldset>
            <fieldset className="name">
              <input placeholder="Name..." type="text" />
            </fieldset>
            <fieldset className="subject">
              <select>
                <option>Choose subject...</option>
                <option>Choose subject...</option>
                <option>Choose subject...</option>
              </select>
            </fieldset>
          </div>
          <div className="right">
            <fieldset className="question">
              <textarea placeholder="Question..."></textarea>
            </fieldset>
          </div>
          <div className="btn-holder">
            <button className="btn blue" type="submit">
              Send request
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

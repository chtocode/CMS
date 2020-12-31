import Carousel from 'antd/lib/carousel';
import Head from 'next/head';
import React from 'react';
import Header from '../components/home/header';

export default function Page() {
  const styles = new Array(8).fill(0).map((_, index) => ({ '--i': index } as React.CSSProperties));

  return (
    <>
      <Head>
        <title>HarrisonHighSchool</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
        <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <script src="/js/jquery-1.11.1.min.js" key="jq"></script>
        <script src="/js/main.js" key="main"></script>
      </Head>

      <Header></Header>

      <div className="divider"></div>

      <div className="content">
        <div className="container">
          <h1 className="single">merit student</h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 300,
            }}
          >
            <div className="gallery-box">
              {styles.map((item, index) => (
                <span style={item}>
                  <img src={`images/5${index === 0 ? '' : '_' + (index + 1)}.png`} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
          <h1 className="single">Photos of the selected category</h1>

          <div className="main-content">
            <div className="slider-con">
              <ul className="bxslider">
                <Carousel autoplay effect="fade" dots={false}>
                  <li>
                    <div className="slide">
                      <ul>
                        <li>
                          <a href="#">
                            <img src="images/5.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_2.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_3.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_4.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_5.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_6.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_7.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_8.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_9.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_10.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_11.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_12.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_13.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_14.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_15.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_16.png" alt="" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div className="slide">
                      <ul>
                        <li>
                          <a href="#">
                            <img src="images/5.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_2.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_3.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_4.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_5.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_6.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_7.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_8.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_9.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_10.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_11.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_12.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_13.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_14.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_15.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="images/5_16.png" alt="" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </Carousel>
              </ul>
            </div>
          </div>

          <aside id="sidebar">
            <div className="widget sidemenu">
              <ul>
                <li>
                  <a href="#">
                    Day of teacher<span className="nr">142</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Student olympics<span className="nr">98</span>
                  </a>
                </li>
                <li className="current">
                  <a href="#">
                    The best students in 2014<span className="nr">16</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Halloween party<span className="nr">63</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    School party<span className="nr">49</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Miss of university<span className="nr">175</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Karaoke party<span className="nr">87</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
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

import Head from 'next/head';
import Header from '../components/home/header';

export default function Page() {
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
          <div className="main-content">
            <h1>Upcoming events</h1>
            <section className="posts-con">
              <article>
                <div className="current-date">
                  <p>April</p>
                  <p className="date">15</p>
                </div>
                <div className="info">
                  <h3>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</h3>
                  <p className="info-line">
                    <span className="time">10:30 AM</span>
                    <span className="place">Lincoln High School</span>
                  </p>
                  <p>
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                    praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                    excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                    officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                    rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis
                    est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
                    possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                  </p>
                </div>
              </article>
              <article>
                <div className="current-date">
                  <p>April</p>
                  <p className="date">17</p>
                </div>
                <div className="info">
                  <h3>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</h3>
                  <p className="info-line">
                    <span className="time">10:30 AM</span>
                    <span className="place">Lincoln High School</span>
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                    veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                    voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </article>
              <article>
                <div className="current-date">
                  <p>April</p>
                  <p className="date">25</p>
                </div>
                <div className="info">
                  <h3>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</h3>
                  <p className="info-line">
                    <span className="time">10:30 AM</span>
                    <span className="place">Lincoln High School</span>
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                    veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                    voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </article>
              <article className="last">
                <div className="current-date">
                  <p>April</p>
                  <p className="date">29</p>
                </div>
                <div className="info">
                  <h3>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</h3>
                  <p className="info-line">
                    <span className="time">10:30 AM</span>
                    <span className="place">Lincoln High School</span>
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                    veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                    voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </article>
            </section>
          </div>

          <aside id="sidebar">
            <div className="widget clearfix calendar">
              <h2>Event calendar</h2>
              <div className="head">
                <a className="prev" href="#"></a>
                <a className="next" href="#"></a>
                <h4>April 2014</h4>
              </div>
              <div className="table">
                <table>
                  <tr>
                    <th className="col-1">Mon</th>
                    <th className="col-2">Tue</th>
                    <th className="col-3">Wed</th>
                    <th className="col-4">Thu</th>
                    <th className="col-5">Fri</th>
                    <th className="col-6">Sat</th>
                    <th className="col-7">Sun</th>
                  </tr>
                  <tr>
                    <td className="col-1 disable">
                      <div>31</div>
                    </td>
                    <td className="col-2">
                      <div>1</div>
                    </td>
                    <td className="col-3">
                      <div>2</div>
                    </td>
                    <td className="col-4">
                      <div>3</div>
                    </td>
                    <td className="col-5 archival">
                      <div>4</div>
                    </td>
                    <td className="col-6">
                      <div>5</div>
                    </td>
                    <td className="col-7">
                      <div>6</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="col-1">
                      <div>7</div>
                    </td>
                    <td className="col-2">
                      <div>8</div>
                    </td>
                    <td className="col-3 archival">
                      <div>9</div>
                    </td>
                    <td className="col-4">
                      <div>10</div>
                    </td>
                    <td className="col-5">
                      <div>11</div>
                    </td>
                    <td className="col-6">
                      <div>12</div>
                    </td>
                    <td className="col-7">
                      <div>13</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="col-1">
                      <div>14</div>
                    </td>
                    <td className="col-2 upcoming">
                      <div>
                        <div className="tooltip">
                          <div className="holder">
                            <h4>Omnis iste natus error sit voluptatem dolor</h4>
                            <p className="info-line">
                              <span className="time">10:30 AM</span>
                              <span className="place">Lincoln High School</span>
                            </p>
                            <p>
                              At vero eos et accusamus et iusto odio dignissimos ducimus qui
                              blanditiis praesentium voluptatum atque corrupti quos dolores et quas
                              molestias excepturi sint occaecati cupiditate non provident similique.
                            </p>
                          </div>
                        </div>
                        15
                      </div>
                    </td>
                    <td className="col-3">
                      <div>16</div>
                    </td>
                    <td className="col-4 upcoming">
                      <div>
                        <div className="tooltip">
                          <div className="holder">
                            <h4>Omnis iste natus error sit voluptatem dolor</h4>
                            <p className="info-line">
                              <span className="time">10:30 AM</span>
                              <span className="place">Lincoln High School</span>
                            </p>
                            <p>
                              At vero eos et accusamus et iusto odio dignissimos ducimus qui
                              blanditiis praesentium voluptatum atque corrupti quos dolores et quas
                              molestias excepturi sint occaecati cupiditate non provident similique.
                            </p>
                          </div>
                        </div>
                        16
                      </div>
                    </td>
                    <td className="col-5">
                      <div>18</div>
                    </td>
                    <td className="col-6">
                      <div>19</div>
                    </td>
                    <td className="col-7">
                      <div>20</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="col-1">
                      <div>21</div>
                    </td>
                    <td className="col-2">
                      <div>22</div>
                    </td>
                    <td className="col-3">
                      <div>23</div>
                    </td>
                    <td className="col-4">
                      <div>24</div>
                    </td>
                    <td className="col-5 upcoming">
                      <div>
                        <div className="tooltip">
                          <div className="holder">
                            <h4>Omnis iste natus error sit voluptatem dolor</h4>
                            <p className="info-line">
                              <span className="time">10:30 AM</span>
                              <span className="place">Lincoln High School</span>
                            </p>
                            <p>
                              At vero eos et accusamus et iusto odio dignissimos ducimus qui
                              blanditiis praesentium voluptatum atque corrupti quos dolores et quas
                              molestias excepturi sint occaecati cupiditate non provident similique.
                            </p>
                          </div>
                        </div>
                        25
                      </div>
                    </td>
                    <td className="col-6">
                      <div>26</div>
                    </td>
                    <td className="col-7">
                      <div>27</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="col-1">
                      <div>28</div>
                    </td>
                    <td className="col-2 upcoming">
                      <div>
                        <div className="tooltip">
                          <div className="holder">
                            <h4>Omnis iste natus error sit voluptatem dolor</h4>
                            <p className="info-line">
                              <span className="time">10:30 AM</span>
                              <span className="place">Lincoln High School</span>
                            </p>
                            <p>
                              At vero eos et accusamus et iusto odio dignissimos ducimus qui
                              blanditiis praesentium voluptatum atque corrupti quos dolores et quas
                              molestias excepturi sint occaecati cupiditate non provident similique.
                            </p>
                          </div>
                        </div>
                        29
                      </div>
                    </td>
                    <td className="col-3">
                      <div>30</div>
                    </td>
                    <td className="col-4 disable">
                      <div>1</div>
                    </td>
                    <td className="col-5 disable">
                      <div>2</div>
                    </td>
                    <td className="col-6 disable">
                      <div>3</div>
                    </td>
                    <td className="col-7 disable">
                      <div>4</div>
                    </td>
                  </tr>
                </table>
              </div>
              <div className="note">
                <p className="upcoming-note">Upcoming event</p>
                <p className="archival-note">Archival event</p>
              </div>
            </div>
            <div className="widget list">
              <h2>Photo gallery</h2>
              <ul>
                <li>
                  <a href="#">
                    <img src="images/4.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="images/4_2.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="images/4_3.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="images/4_4.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="images/4_5.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="images/4_6.png" alt="" />
                  </a>
                </li>
              </ul>
              <div className="btn-holder">
                <a className="btn blue" href="#">
                  Show more photos
                </a>
              </div>
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

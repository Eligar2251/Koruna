import '../pages/home/design/page.css'
import { Brand } from '../brand/Brand'
import { MenuButton } from './MenuButton'
import { CartCount } from '../cart/CartCount'

export function Header() {
  return (
    <header id={"t-header"} className={"t-records"}>
      <div id={"rec2050530551"} className={"r t-rec"} data-record-type={"1272"}>
        <div id={"nav2050530551marker"} />
        <div className={"t1272"} data-menu={"yes"} data-full-submenu-mob={"y"} data-menu-widgeticon-search={"yes"} data-menu-widgeticon-cart={"yes"} data-menu-widgeticons-hide={"yes"}>
          <div className={"t-menu-base__mobile-menu tmenu-mobile tmenu-mobile_positionfixed"}>
            <div className={"tmenu-mobile__container tmenu-mobile__container_right tmenu-mobile__container_logoleft"}>
              <div className={"t-menu-base__logowrapper t-menu-base__logowrapper_left t-menu-base__logowrapper_both t-menu-base__logowrapper_mobile"}>
                <div className={"t-menu-base__logo"}>
                  <Brand />
                </div>
              </div>
              <ul className={"t-menuwidgeticons__wrapper"}>
                <li className={"t-menuwidgeticons__icon t-menuwidgeticons__icon_sm t-menuwidgeticons__search"}>
                  <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_search"} href={"/katalog"} role={"button"} aria-label={"Search"}>
                    <div className={"t-menuwidgeticons__img t-menuwidgeticons__img_search"}>
                      <svg viewBox={"0 0 22 22"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                        <circle cx={"10.1224"} cy={"10.8801"} r={"7.69888"} transform={"rotate(47.1675 10.1224 10.8801)"} stroke={"#3d3d3d"} strokeWidth={"2"} />
                        <line x1={"16.4142"} y1={"17"} x2={"20.3033"} y2={"20.8891"} stroke={"#3d3d3d"} strokeWidth={"2"} strokeLinecap={"round"} />
                      </svg>
                    </div>
                  </a>
                </li>
                <li className={"t-menuwidgeticons__icon t-menuwidgeticons__icon_sm t-menuwidgeticons__cart"}>
                  <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_cart"} href={"/korzina"} role={"button"} aria-label={"Cart"}>
                    <div className={"t-menuwidgeticons__img t-menuwidgeticons__img_carticon"}>
                      <svg viewBox={"0 0 22 22"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                        <path d={"M3.67986 6.91023C3.72631 6.39482 4.15832 6 4.67582 6H17.3242C17.8417 6 18.2737 6.39482 18.3201 6.91023L19.4018 18.9102C19.4545 19.4956 18.9935 20 18.4058 20H3.59419C3.00646 20 2.54547 19.4956 2.59823 18.9102L3.67986 6.91023Z"} stroke={"#3d3d3d"} strokeWidth={"1.8"} />
                        <path d={"M15 9V5C15 2.79086 13.2091 1 11 1C8.79086 1 7 2.79086 7 5V9"} stroke={"#3d3d3d"} strokeWidth={"1.85"} />
                      </svg>
                      <CartCount />
                    </div>
                  </a>
                </li>
              </ul>
              <MenuButton />
            </div>
          </div>
          <div id={"nav2050530551"} className={"t-menu-base t-menu-base_positionfixed\ntmenu-mobile__menucontent_hidden tmenu-mobile__menucontent_fixed t-menu-base_mobile-left\nt-menu-base__burgermenu__default"} data-navmarker={"nav2050530551marker"} data-appearoffset={""} data-bgopacity-two={"1"} data-menu={"yes"} data-bgcolor-hex={"#ffffff"} data-bgcolor-rgba={"rgba(255,255,255,1)"} data-bgopacity={"1"} data-menushadow={""} data-menushadow-css={""}>
            <div className={"t-menu-base__maincontainer\nt-menu-base__maincontainer_100 t-menu-base__maincontainer_100-40 t-menu-base__maincontainer_logoleft "}>
              <div className={"t-menu-base__logowrapper t-menu-base__logowrapper_left t-menu-base__logowrapper_both"}>
                <div className={"t-menu-base__logo"}>
                  <Brand />
                </div>
              </div>
              <div className={"t-menu-base__leftwrapper t-menu-base__wrapper t-menu-base__leftwrapper_left"}>
                <ul role={"list"} className={"t-menu-base__list t-menu__list "}>
                  <li className={"t-menu-base__list-item"}>
                    <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                      <a className={"t-menu__link-item"} href={"/"} data-menu-item-number={"1"}>
                        {"\u0413\u043b\u0430\u0432\u043d\u0430\u044f"}
                      </a>
                    </div>
                  </li>
                  <li className={"t-menu-base__list-item"}>
                    <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={"link_sub2_2050530551"}>
                      <a className={"t-menu__link-item"} href={""} data-menu-item-number={"2"}>
                        {"\u041a\u0430\u0442\u0430\u043b\u043e\u0433"}
                      </a>
                    </div>
                    <div className={"t-menusub"} data-submenu-hook={"link_sub2_2050530551"} data-submenu-margin={"15px"} data-add-submenu-arrow={"on"} data-columns-count={"1"}>
                      <div className={"t-menusub__menu "}>
                        <div className={"t-menusub__menu-wrapper"}>
                          <div className={"t-menusub__innermenu-content t-menusub__innermenu-content_level1 t-menusub__innermenu-content_left"} data-submenu-hook={"link_sub2_2050530551"}>
                            <ul role={"menu"} className={"t-menusub__innermenu-list t-menusub__list"}>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/listovye-materialy"} data-menu-item-number={"2"}>
                                    {" \u041b\u0438\u0441\u0442\u043e\u0432\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b "}
                                  </a>
                                </div>
                              </li>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/uteplitel"} data-menu-item-number={"2"}>
                                    {" \u0423\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c "}
                                  </a>
                                </div>
                              </li>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/polikarbonat"} data-menu-item-number={"2"}>
                                    {" \u041f\u043e\u043b\u0438\u043a\u0430\u0440\u0431\u043e\u043d\u0430\u0442 "}
                                  </a>
                                </div>
                              </li>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/gidro-paroizolyaziya"} data-menu-item-number={"2"}>
                                    {" \u0412\u0435\u0442\u0440\u043e- \u0438 \u043f\u0430\u0440\u043e\u0438\u0437\u043e\u043b\u044f\u0446\u0438\u044f "}
                                  </a>
                                </div>
                              </li>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/profil-karkas"} data-menu-item-number={"2"}>
                                    {" \u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0438 \u043a\u0430\u0440\u043a\u0430\u0441 "}
                                  </a>
                                </div>
                              </li>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/montajnaya-himiya"} data-menu-item-number={"2"}>
                                    {" \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u0430\u044f \u0445\u0438\u043c\u0438\u044f "}
                                  </a>
                                </div>
                              </li>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/krepej-i-metizy"} data-menu-item-number={"2"}>
                                    {" \u041a\u0440\u0435\u043f\u0435\u0436 \u0438 \u043c\u0435\u0442\u0438\u0437\u044b "}
                                  </a>
                                </div>
                              </li>
                              <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                <div className={"t-menusub__link-wrapper"}>
                                  <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/krovelnye-materialy"} data-menu-item-number={"2"}>
                                    {" \u041a\u0440\u043e\u0432\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b "}
                                  </a>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className={"t-menusub__innermenu"} style={{width: "250px"}} />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className={"t-menu-base__list-item"}>
                    <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                      <a className={"t-menu__link-item"} href={"/sotrudnichestvo"} data-menu-item-number={"3"}>
                        {"\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e"}
                      </a>
                    </div>
                  </li>
                  <li className={"t-menu-base__list-item"}>
                    <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                      <a className={"t-menu__link-item"} href={"/oplata-i-dostavka"} data-menu-item-number={"4"}>
                        {"\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0438 \u043e\u043f\u043b\u0430\u0442\u0430"}
                      </a>
                    </div>
                  </li>
                  <li className={"t-menu-base__list-item"}>
                    <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                      <a className={"t-menu__link-item"} href={"/o-kompanii"} data-menu-item-number={"5"}>
                        {"\u041e \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438"}
                      </a>
                    </div>
                  </li>
                  <li className={"t-menu-base__list-item"}>
                    <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                      <a className={"t-menu__link-item"} href={"/contact"} data-menu-item-number={"6"}>
                        {"\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b"}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
              <div className={"t-menu-base__rightwrapper t-menu-base__wrapper"}>
                <div className={"t-menu-base__additionalwrapper"}>
                  <div className={"t-menu-base__right_descr"} field={"descr"}>
                    <p style={{textAlign: "left"}}>
                      <strong style={{color: "rgb(61, 61, 61)", fontWeight: "700"}}>
                        {"+7 961 222 03 05"}
                      </strong>
                    </p>
                    <p style={{textAlign: "left"}}>
                      <strong style={{color: "rgb(61, 61, 61)"}}>
                        <a href={"tel:+738325555 99"} style={{color: "rgb(61, 61, 61)"}}>
                          {"+7 383 255 55 99"}
                        </a>
                      </strong>
                    </p>
                  </div>
                  <div className={"t-sociallinks"}>
                    <ul role={"list"} className={"t-sociallinks__wrapper"} aria-label={"Social media links"}>
                      <li className={"t-sociallinks__item t-sociallinks__item_telegram"}>
                        <span className={"koruna-nolink"} target={"_blank"} rel={"nofollow"} aria-label={"telegram"} style={{width: "30px", height: "30px"}}>
                          <svg className={"t-sociallinks__svg"} role={"presentation"} width={"30px"} height={"30px"} viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                            <path fillRule={"evenodd"} clipRule={"evenodd"} d={"M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm21.977-68.056c.386-4.38-4.24-2.576-4.24-2.576-3.415 1.414-6.937 2.85-10.497 4.302-11.04 4.503-22.444 9.155-32.159 13.734-5.268 1.932-2.184 3.864-2.184 3.864l8.351 2.577c3.855 1.16 5.91-.129 5.91-.129l17.988-12.238c6.424-4.38 4.882-.773 3.34.773l-13.49 12.882c-2.056 1.804-1.028 3.35-.129 4.123 2.55 2.249 8.82 6.364 11.557 8.16.712.467 1.185.778 1.292.858.642.515 4.111 2.834 6.424 2.319 2.313-.516 2.57-3.479 2.57-3.479l3.083-20.226c.462-3.511.993-6.886 1.417-9.582.4-2.546.705-4.485.767-5.362Z"} fill={"#1C6B5A"} />
                          </svg>
                        </span>
                      </li>
                      <li className={"t-sociallinks__item t-sociallinks__item_maxmessenger"}>
                        <span className={"koruna-nolink"} target={"_blank"} rel={"nofollow"} aria-label={"maxmessenger"} style={{width: "30px", height: "30px"}}>
                          <svg className={"t-sociallinks__svg"} role={"presentation"} width={"30px"} height={"30px"} viewBox={"0 0 48 48"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                            <path fillRule={"evenodd"} clipRule={"evenodd"} d={"M24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0ZM24.2314 12.5C17.8663 12.5 12.4942 17.4255 12.4941 23.9727C12.4941 26.714 13.0015 28.6059 13.4482 30.3047C13.8233 31.6836 14.1543 32.9467 14.1543 34.4414C14.3143 36.4326 17.9823 35.2685 19.1406 33.7793C20.9718 35.1031 22.0251 35.4346 24.292 35.4346C30.5586 35.4011 35.6151 30.2999 35.5938 24.0332C35.5937 17.6682 30.602 12.5 24.2314 12.5ZM24.3857 18.1592V18.165C27.5981 18.349 30.0709 21.0719 29.9453 24.2871C29.7296 27.4955 26.9854 29.9406 23.7734 29.7861C22.768 29.7055 21.8016 29.3614 20.9717 28.7881C20.4699 29.2899 19.6648 29.9402 19.3447 29.8633C18.6774 29.6868 17.8938 26.2951 18.335 23.5098C18.87 20.1452 21.2859 17.9993 24.3857 18.1592Z"} fill={"#1C6B5A"} />
                          </svg>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <ul className={"t-menuwidgeticons__wrapper"}>
                    <li className={"t-menuwidgeticons__icon t-menuwidgeticons__icon_sm t-menuwidgeticons__search"}>
                      <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_search"} href={"/katalog"} role={"button"} aria-label={"Search"}>
                        <div className={"t-menuwidgeticons__img t-menuwidgeticons__img_search"}>
                          <svg viewBox={"0 0 22 22"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                            <circle cx={"10.1224"} cy={"10.8801"} r={"7.69888"} transform={"rotate(47.1675 10.1224 10.8801)"} stroke={"#3d3d3d"} strokeWidth={"2"} />
                            <line x1={"16.4142"} y1={"17"} x2={"20.3033"} y2={"20.8891"} stroke={"#3d3d3d"} strokeWidth={"2"} strokeLinecap={"round"} />
                          </svg>
                        </div>
                      </a>
                    </li>
                    <li className={"t-menuwidgeticons__icon t-menuwidgeticons__icon_sm t-menuwidgeticons__cart"}>
                      <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_cart"} href={"/korzina"} role={"button"} aria-label={"Cart"}>
                        <div className={"t-menuwidgeticons__img t-menuwidgeticons__img_carticon"}>
                          <svg viewBox={"0 0 22 22"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                            <path d={"M3.67986 6.91023C3.72631 6.39482 4.15832 6 4.67582 6H17.3242C17.8417 6 18.2737 6.39482 18.3201 6.91023L19.4018 18.9102C19.4545 19.4956 18.9935 20 18.4058 20H3.59419C3.00646 20 2.54547 19.4956 2.59823 18.9102L3.67986 6.91023Z"} stroke={"#3d3d3d"} strokeWidth={"1.8"} />
                            <path d={"M15 9V5C15 2.79086 13.2091 1 11 1C8.79086 1 7 2.79086 7 5V9"} stroke={"#3d3d3d"} strokeWidth={"1.85"} />
                          </svg>
                          <CartCount />
                        </div>
                      </a>
                    </li>
                  </ul>
                  <div className={"t-menu-base__buttons"}>
                    <div className={"t-menu-base__button"}>
                      <span className={"koruna-nolink t-btn t-btnflex t-btnflex_type_button t-btnflex_xs"} target={"_blank"}>
                        <span className={"t-btnflex__text"}>
                          {"\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0446\u0435\u043d\u0443"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

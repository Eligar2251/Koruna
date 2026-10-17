import { SiteBackgroundLink, SiteImage, SiteBackground } from '../../site/SiteImage'
import { SiteText, SiteLink, InquiryButton } from '../../site/SiteProvider'
import './design/page.css'
import { Brand } from '../../brand/Brand'
import { MenuButton } from '../../chrome/MenuButton'
import { CartCount } from '../../cart/CartCount'

export function HomePage() {
  return (
    <>
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-grid-3.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/ws/project22824286/tilda-blocks-page124225796.min.c369d01b43.css" />
      <link rel="stylesheet" href="/_fonts.googleapis.com/css2.bf76316f5c.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-menusub-1.1.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-menu-widgeticons-1.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-menu-burger-1.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-forms-1.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-cart-1.0.min.css" />
      <div id={"allrecords"} className={"t-records"}>
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
                      <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_search"} href={"/katalog"} role={"button"} aria-label={"Поиск по каталогу"}>
                        <div className={"t-menuwidgeticons__img t-menuwidgeticons__img_search"}>
                          <svg viewBox={"0 0 22 22"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                            <circle cx={"10.1224"} cy={"10.8801"} r={"7.69888"} transform={"rotate(47.1675 10.1224 10.8801)"} stroke={"#3d3d3d"} strokeWidth={"2"} />
                            <line x1={"16.4142"} y1={"17"} x2={"20.3033"} y2={"20.8891"} stroke={"#3d3d3d"} strokeWidth={"2"} strokeLinecap={"round"} />
                          </svg>
                        </div>
                      </a>
                    </li>
                    <li className={"t-menuwidgeticons__icon t-menuwidgeticons__icon_sm t-menuwidgeticons__cart"}>
                      <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_cart"} href={"/korzina"} role={"button"} aria-label={"Корзина"}>
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
                            <SiteText id="d328e53dc456" fallback={"\u0413\u043b\u0430\u0432\u043d\u0430\u044f"} />
                          </a>
                        </div>
                      </li>
                      <li className={"t-menu-base__list-item"}>
                        <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={"link_sub2_2050530551"}>
                          <a className={"t-menu__link-item"} href={"/katalog"} data-menu-item-number={"2"}>
                            <SiteText id="d0ef3540b088" fallback={"\u041a\u0430\u0442\u0430\u043b\u043e\u0433"} />
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
                                        <SiteText id="d2ea2dffe8cb" fallback={" \u041b\u0438\u0441\u0442\u043e\u0432\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b "} />
                                      </a>
                                    </div>
                                  </li>
                                  <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                    <div className={"t-menusub__link-wrapper"}>
                                      <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/uteplitel"} data-menu-item-number={"2"}>
                                        <SiteText id="3bde2b8fb3a3" fallback={" \u0423\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c "} />
                                      </a>
                                    </div>
                                  </li>
                                  <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                    <div className={"t-menusub__link-wrapper"}>
                                      <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/polikarbonat"} data-menu-item-number={"2"}>
                                        <SiteText id="9bbd30bdf89d" fallback={" \u041f\u043e\u043b\u0438\u043a\u0430\u0440\u0431\u043e\u043d\u0430\u0442 "} />
                                      </a>
                                    </div>
                                  </li>
                                  <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                    <div className={"t-menusub__link-wrapper"}>
                                      <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/gidro-paroizolyaziya"} data-menu-item-number={"2"}>
                                        <SiteText id="a91e14fc9001" fallback={" \u0412\u0435\u0442\u0440\u043e- \u0438 \u043f\u0430\u0440\u043e\u0438\u0437\u043e\u043b\u044f\u0446\u0438\u044f "} />
                                      </a>
                                    </div>
                                  </li>
                                  <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                    <div className={"t-menusub__link-wrapper"}>
                                      <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/profil-karkas"} data-menu-item-number={"2"}>
                                        <SiteText id="6b91aa48931a" fallback={" \u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0438 \u043a\u0430\u0440\u043a\u0430\u0441 "} />
                                      </a>
                                    </div>
                                  </li>
                                  <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                    <div className={"t-menusub__link-wrapper"}>
                                      <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/montajnaya-himiya"} data-menu-item-number={"2"}>
                                        <SiteText id="ef2bf42db011" fallback={" \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u0430\u044f \u0445\u0438\u043c\u0438\u044f "} />
                                      </a>
                                    </div>
                                  </li>
                                  <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                    <div className={"t-menusub__link-wrapper"}>
                                      <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/krepej-i-metizy"} data-menu-item-number={"2"}>
                                        <SiteText id="16ef775ba3c3" fallback={" \u041a\u0440\u0435\u043f\u0435\u0436 \u0438 \u043c\u0435\u0442\u0438\u0437\u044b "} />
                                      </a>
                                    </div>
                                  </li>
                                  <li className={"t-menusub__list-item t-menusub__innermenu-item t-name t-name_xs"} role={"none"}>
                                    <div className={"t-menusub__link-wrapper"}>
                                      <a className={"t-menusub__link-item t-name t-name_xs"} role={"menuitem"} href={"/katalog/krovelnye-materialy"} data-menu-item-number={"2"}>
                                        <SiteText id="b96e8191acf0" fallback={" \u041a\u0440\u043e\u0432\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b "} />
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
                            <SiteText id="5a6da5b51fcb" fallback={"\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e"} />
                          </a>
                        </div>
                      </li>
                      <li className={"t-menu-base__list-item"}>
                        <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                          <a className={"t-menu__link-item"} href={"/oplata-i-dostavka"} data-menu-item-number={"4"}>
                            <SiteText id="4156d0817d0f" fallback={"\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0438 \u043e\u043f\u043b\u0430\u0442\u0430"} />
                          </a>
                        </div>
                      </li>
                      <li className={"t-menu-base__list-item"}>
                        <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                          <a className={"t-menu__link-item"} href={"/o-kompanii"} data-menu-item-number={"5"}>
                            <SiteText id="2a0fba3dcf0f" fallback={"\u041e \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438"} />
                          </a>
                        </div>
                      </li>
                      <li className={"t-menu-base__list-item"}>
                        <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={""}>
                          <a className={"t-menu__link-item"} href={"/contact"} data-menu-item-number={"6"}>
                            <SiteText id="fca8d5aa3c1a" fallback={"\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b"} />
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
                            <SiteText field="phone1" fallback={"+7 961 222 03 05"} />
                          </strong>
                        </p>
                        <p style={{textAlign: "left"}}>
                          <strong style={{color: "rgb(61, 61, 61)"}}>
                            <SiteLink field="phone2" style={{color: "rgb(61, 61, 61)"}}>
                              <SiteText field="phone2" fallback={"+7 383 255 55 99"} />
                            </SiteLink>
                          </strong>
                        </p>
                      </div>
                      <div className={"t-sociallinks"}>
                        <ul role={"list"} className={"t-sociallinks__wrapper"} aria-label={"Social media links"}>
                          <li className={"t-sociallinks__item t-sociallinks__item_telegram"}>
                            <InquiryButton className={"koruna-nolink"} target={"_blank"} rel={"nofollow"} aria-label={"telegram"} style={{width: "30px", height: "30px"}}>
                              <svg className={"t-sociallinks__svg"} role={"presentation"} width={"30px"} height={"30px"} viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                                <path fillRule={"evenodd"} clipRule={"evenodd"} d={"M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm21.977-68.056c.386-4.38-4.24-2.576-4.24-2.576-3.415 1.414-6.937 2.85-10.497 4.302-11.04 4.503-22.444 9.155-32.159 13.734-5.268 1.932-2.184 3.864-2.184 3.864l8.351 2.577c3.855 1.16 5.91-.129 5.91-.129l17.988-12.238c6.424-4.38 4.882-.773 3.34.773l-13.49 12.882c-2.056 1.804-1.028 3.35-.129 4.123 2.55 2.249 8.82 6.364 11.557 8.16.712.467 1.185.778 1.292.858.642.515 4.111 2.834 6.424 2.319 2.313-.516 2.57-3.479 2.57-3.479l3.083-20.226c.462-3.511.993-6.886 1.417-9.582.4-2.546.705-4.485.767-5.362Z"} fill={"#1C6B5A"} />
                              </svg>
                            </InquiryButton>
                          </li>
                          <li className={"t-sociallinks__item t-sociallinks__item_maxmessenger"}>
                            <InquiryButton className={"koruna-nolink"} target={"_blank"} rel={"nofollow"} aria-label={"maxmessenger"} style={{width: "30px", height: "30px"}}>
                              <svg className={"t-sociallinks__svg"} role={"presentation"} width={"30px"} height={"30px"} viewBox={"0 0 48 48"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                                <path fillRule={"evenodd"} clipRule={"evenodd"} d={"M24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0ZM24.2314 12.5C17.8663 12.5 12.4942 17.4255 12.4941 23.9727C12.4941 26.714 13.0015 28.6059 13.4482 30.3047C13.8233 31.6836 14.1543 32.9467 14.1543 34.4414C14.3143 36.4326 17.9823 35.2685 19.1406 33.7793C20.9718 35.1031 22.0251 35.4346 24.292 35.4346C30.5586 35.4011 35.6151 30.2999 35.5938 24.0332C35.5937 17.6682 30.602 12.5 24.2314 12.5ZM24.3857 18.1592V18.165C27.5981 18.349 30.0709 21.0719 29.9453 24.2871C29.7296 27.4955 26.9854 29.9406 23.7734 29.7861C22.768 29.7055 21.8016 29.3614 20.9717 28.7881C20.4699 29.2899 19.6648 29.9402 19.3447 29.8633C18.6774 29.6868 17.8938 26.2951 18.335 23.5098C18.87 20.1452 21.2859 17.9993 24.3857 18.1592Z"} fill={"#1C6B5A"} />
                              </svg>
                            </InquiryButton>
                          </li>
                        </ul>
                      </div>
                      <ul className={"t-menuwidgeticons__wrapper"}>
                        <li className={"t-menuwidgeticons__icon t-menuwidgeticons__icon_sm t-menuwidgeticons__search"}>
                          <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_search"} href={"/katalog"} role={"button"} aria-label={"Поиск по каталогу"}>
                            <div className={"t-menuwidgeticons__img t-menuwidgeticons__img_search"}>
                              <svg viewBox={"0 0 22 22"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
                                <circle cx={"10.1224"} cy={"10.8801"} r={"7.69888"} transform={"rotate(47.1675 10.1224 10.8801)"} stroke={"#3d3d3d"} strokeWidth={"2"} />
                                <line x1={"16.4142"} y1={"17"} x2={"20.3033"} y2={"20.8891"} stroke={"#3d3d3d"} strokeWidth={"2"} strokeLinecap={"round"} />
                              </svg>
                            </div>
                          </a>
                        </li>
                        <li className={"t-menuwidgeticons__icon t-menuwidgeticons__icon_sm t-menuwidgeticons__cart"}>
                          <a className={"t-menuwidgeticons__link t-menuwidgeticons__link_cart"} href={"/korzina"} role={"button"} aria-label={"Корзина"}>
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
                          <InquiryButton className={"koruna-nolink t-btn t-btnflex t-btnflex_type_button t-btnflex_xs"} target={"_blank"}>
                            <span className={"t-btnflex__text"}>
                              <SiteText id="433a41ce1d7f" fallback={"\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0446\u0435\u043d\u0443"} />
                            </span>
                          </InquiryButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div id={"rec1995798231"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"1995798231"} data-artboard-screens={"320,960,1200"} data-artboard-height={"550"} data-artboard-valign={"center"} data-artboard-upscale={"window"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"1995798231"} />
                <div className={"t396__filter"} data-artboard-recid={"1995798231"} />
                <div className={"t396__elem tn-elem tn-elem__19957982311772697238325 "} data-elem-id={"1772697238325"} data-elem-type={"shape"} data-animate-sbs-event={"scroll"} data-animate-sbs-trg={"1"} data-animate-sbs-trgofst={"0"} data-animate-sbs-opts={"[{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'di':'0','dd':'0','fi':'0'},{'mx':0,'my':0,'sx':1.3,'sy':1.3,'op':1,'ro':0,'di':2000,'dd':'0','fi':'0'}]"}>
                  <SiteBackground className={"tn-atom t-bgimg"} aria-label={""} role={"img"} original={"/_thb.tildacdn.com/tild3835-3138-4261-a437-653235663132/-/resize/20x/photo_2026-03-06_10-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772766242264"} data-elem-id={"1772766242264"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772697320493"} data-elem-id={"1772697320493"} data-elem-type={"text"}>
                  <h1 className={"tn-atom"} field={"tn_text_1772697320493"}>
                    <SiteText id="2a014c8c855a" fallback={"\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u043f\u043e \u043e\u043f\u0442\u043e\u0432\u044b\u043c \u0446\u0435\u043d\u0430\u043c \u0432 \u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0435 \u0441 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u043e\u0439 \u0432 \u0434\u0435\u043d\u044c \u0437\u0430\u043a\u0430\u0437\u0430"} />
                  </h1>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772763559813"} data-elem-id={"1772763559813"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772763559813"}>
                    <SiteText id="c0c83b2e44d8" fallback={"\u041e\u0441\u043f-3, \u0443\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c, \u0433\u0438\u043f\u0441\u043e\u043a\u0430\u0440\u0442\u043e\u043d, \u043f\u043e\u043b\u0438\u043a\u0430\u0440\u0431\u043e\u043d\u0430\u0442, \u0438\u0437\u043e\u043b\u044f\u0446\u0438\u044f, \u043f\u0440\u043e\u0444\u0438\u043b\u044c, \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u0430\u044f \u0445\u0438\u043c\u0438\u044f \u0438 \u043a\u0440\u0435\u043f\u0435\u0436 \u2014 \u043e\u0442 1 \u0448\u0442\u0443\u043a\u0438."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772763625159"} data-elem-id={"1772763625159"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765076864"} data-elem-id={"1772765076864"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765175997000002"} data-elem-id={"1772765175997000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765185502000003"} data-elem-id={"1772765185502000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765203983"} data-elem-id={"1772765203983"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765203983"}>
                    <SiteText id="136ced0acaf5" fallback={"\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0422\u041a \u043f\u043e \u0420\u0424"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765302499000004"} data-elem-id={"1772765302499000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765302499000004"}>
                    <SiteText id="08f66147c449" fallback={"\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e\u0435 \u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765469112000001"} data-elem-id={"1772765469112000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765469112000001"}>
                    <SiteText id="71c41c0b91ff" fallback={"\u0421\u043a\u043b\u0430\u0434 \u0432 \u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0435"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765512259000002"} data-elem-id={"1772765512259000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765512259000003"} data-elem-id={"1772765512259000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765512259000003"}>
                    <SiteText id="4818a542aa83" fallback={"\u041f\u0440\u044f\u043c\u044b\u0435 \u043f\u043e\u0441\u0442\u0430\u0432\u043a\u0438"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765844655"} data-elem-id={"1772765844655"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3935-3634-4166-b834-396462666233/photo.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772765950999000001"} data-elem-id={"1772765950999000001"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3632-3532-4462-b630-393833343033/photo.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772766053215000002"} data-elem-id={"1772766053215000002"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6131-3161-4431-b834-363361336466/photo.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__19957982311772766164812000003"} data-elem-id={"1772766164812000003"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6164-3538-4231-b937-343463613764/photo.svg"} alt={""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000131321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000131321"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2000131321"} />
              <div className={"t396__filter"} data-artboard-recid={"2000131321"} />
            </div>
          </div>
        </div>
        <div id={"rec2000129831"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000129831"} data-artboard-screens={"320,960,1200"} data-artboard-height={"128"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"140"} data-artboard-height-res-960={"128"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2000129831"} />
                <div className={"t396__filter"} data-artboard-recid={"2000129831"} />
                <div className={"t396__elem tn-elem tn-elem__20001298311772767507761"} data-elem-id={"1772767507761"} data-elem-type={"text"}>
                  <h2 className={"tn-atom"} field={"tn_text_1772767507761"}>
                    <SiteText id="bac921e314cb" fallback={"\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u043e\u0432"} />
                  </h2>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001298311772767741642"} data-elem-id={"1772767741642"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772767741642"}>
                    <SiteText id="425690086212" fallback={"\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0443\u0435\u043c \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u043f\u043e\u0434 \u043a\u043b\u044e\u0447 \u2014 \u043e\u0442 \u043b\u0438\u0441\u0442\u043e\u0432\u044b\u0445 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u043e\u0432 \u0434\u043e \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u0445\u0438\u043c\u0438\u0438"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000154801"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000154801"} data-artboard-screens={"320,960,1200"} data-artboard-height={"410"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"440"} data-artboard-height-res-960={"340"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2000154801"} />
                <div className={"t396__filter"} data-artboard-recid={"2000154801"} />
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772769448786"} data-elem-id={"1772769448786"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/listovye-materialy"} aria-label={""} role={"img"} original={"/_thb.tildacdn.com/tild6230-3665-4436-a665-336634393365/-/resize/20x/photo_2026-02-27_14-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775083791"} data-elem-id={"1772775083791"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772773736744000001"} data-elem-id={"1772773736744000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772773766034"} data-elem-id={"1772773766034"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772773766034"}>
                    <SiteText id="c6ebe619b086" fallback={"\u041b\u0438\u0441\u0442\u043e\u0432\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772775053407000001"} data-elem-id={"1772775053407000001"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/uteplitel"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild6136-6465-4339-a663-646563636233/photo_2026-02-27_14-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775227327000001"} data-elem-id={"1772775227327000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775053408000002"} data-elem-id={"1772775053408000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775053408000003"} data-elem-id={"1772775053408000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772775053408000003"}>
                    <SiteText id="b870b1bd42ad" fallback={"\u0423\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772775062361000004"} data-elem-id={"1772775062361000004"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/polikarbonat"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild3964-6133-4433-b638-346263396133/photo_2026-03-13_11-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775236374000002"} data-elem-id={"1772775236374000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775062362000005"} data-elem-id={"1772775062362000005"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775062362000006"} data-elem-id={"1772775062362000006"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772775062362000006"}>
                    <SiteText id="21134f5447bc" fallback={"\u041f\u043e\u043b\u0438\u043a\u0430\u0440\u0431\u043e\u043d\u0430\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772775062362000007"} data-elem-id={"1772775062362000007"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/gidro-paroizolyaziya"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild6438-3365-4836-a163-316332613933/photo_2026-03-12_21-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775242844000003"} data-elem-id={"1772775242844000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775062362000008"} data-elem-id={"1772775062362000008"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775062362000009"} data-elem-id={"1772775062362000009"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772775062362000009"}>
                    <SiteText id="fc2d94e3bc01" fallback={"\u0412\u0435\u0442\u0440\u043e- \u043f\u0430\u0440\u043e\u0438\u0437\u043e\u043b\u044f\u0446\u0438\u044f"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772775875087000001"} data-elem-id={"1772775875087000001"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/profil-karkas"} aria-label={""} role={"img"} original={"/_thb.tildacdn.com/tild3136-6334-4563-b161-643961613863/-/resize/20x/photo_2025-12-15_16-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875087000002"} data-elem-id={"1772775875087000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000003"} data-elem-id={"1772775875088000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000004"} data-elem-id={"1772775875088000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772775875088000004"}>
                    <SiteText id="c28369e80e10" fallback={"\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0438 \u043a\u0430\u0440\u043a\u0430\u0441"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772775875088000005"} data-elem-id={"1772775875088000005"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/montajnaya-himiya"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild3232-6536-4139-a630-653631656532/photo_2026-03-06_13-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000006"} data-elem-id={"1772775875088000006"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000007"} data-elem-id={"1772775875088000007"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000008"} data-elem-id={"1772775875088000008"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772775875088000008"}>
                    <SiteText id="bc52459052f3" fallback={"\u041c\u043e\u043d\u0442\u0430\u0436\u043d\u0430\u044f \u0445\u0438\u043c\u0438\u044f"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772775875088000009"} data-elem-id={"1772775875088000009"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/krepej-i-metizy"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild3434-3864-4938-b261-666135373832/photo_2026-03-06_13-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000010"} data-elem-id={"1772775875088000010"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000011"} data-elem-id={"1772775875088000011"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000012"} data-elem-id={"1772775875088000012"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772775875088000012"}>
                    <SiteText id="4bccd875cfca" fallback={"\u041a\u0440\u0435\u043f\u0435\u0436 \u0438 \u043c\u0435\u0442\u0438\u0437\u044b"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem zoomon tn-elem__20001548011772775875088000013"} data-elem-id={"1772775875088000013"} data-elem-type={"shape"}>
                  <SiteBackgroundLink className={"tn-atom t-bgimg"} href={"/katalog/krovelnye-materialy"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild6538-6131-4862-b562-363331623737/773cac9b72a11f19bfec.jpeg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773215059680000006"} data-elem-id={"1773215059680000006"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773215059680000006"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773215068179000007"} data-elem-id={"1773215068179000007"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773215068179000007"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773215094177000008"} data-elem-id={"1773215094177000008"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773215094177000008"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773214999932000003"} data-elem-id={"1773214999932000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773214999932000003"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773215022780000004"} data-elem-id={"1773215022780000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773215022780000004"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773215039599000005"} data-elem-id={"1773215039599000005"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773215039599000005"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000014"} data-elem-id={"1772775875088000014"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000015"} data-elem-id={"1772775875088000015"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011772775875088000016"} data-elem-id={"1772775875088000016"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772775875088000016"}>
                    <SiteText id="108a182dcc69" fallback={"\u041a\u0440\u043e\u0432\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773215116818000009"} data-elem-id={"1773215116818000009"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773215116818000009"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20001548011773214941431000002"} data-elem-id={"1773214941431000002"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773214941431000002"}>
                    {">"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000131321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"121"} data-alias-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000131321"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2000131321"} />
              <div className={"t396__filter"} data-artboard-recid={"2000131321"} />
            </div>
          </div>
        </div>
        <div id={"rec2012261111"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2012261111"} data-artboard-screens={"320,960,1200"} data-artboard-height={"288"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"408"} data-artboard-height-res-960={"258"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2012261111"} />
                <div className={"t396__filter"} data-artboard-recid={"2012261111"} />
                <div className={"t396__elem tn-elem tn-elem__20122611111772767507761"} data-elem-id={"1772767507761"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772767507761"}>
                    <SiteText id="e38a3ad9044b" fallback={"\u0417\u0430\u043a\u0440\u043e\u0439\u0442\u0435 \u0432\u0441\u0435 \u044d\u0442\u0430\u043f\u044b \u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127169759000001"} data-elem-id={"1773127169759000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127169759000001"}>
                    <SiteText id="4cfb55b24b48" fallback={"\u041f\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u043c \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0434\u043b\u044f:"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127223845000005"} data-elem-id={"1773127223845000005"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127263835"} data-elem-id={"1773127263835"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127263835"}>
                    <SiteText id="59ff978b0192" fallback={"\u041a\u0430\u0440\u043a\u0430\u0441\u043d\u044b\u0445 \u0440\u0430\u0431\u043e\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127472180"} data-elem-id={"1773127472180"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127116794"} data-elem-id={"1773127116794"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127290594000006"} data-elem-id={"1773127290594000006"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127290594000006"}>
                    <SiteText id="36a515089261" fallback={"\u0423\u0442\u0435\u043f\u043b\u0435\u043d\u0438\u044f"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127616291000001"} data-elem-id={"1773127616291000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127204169000002"} data-elem-id={"1773127204169000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127309432000007"} data-elem-id={"1773127309432000007"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127309432000007"}>
                    <SiteText id="0fa3d7a0284d" fallback={"\u041e\u0431\u0448\u0438\u0432\u043a\u0438"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127637417000002"} data-elem-id={"1773127637417000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127208158000003"} data-elem-id={"1773127208158000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127319244000008"} data-elem-id={"1773127319244000008"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127319244000008"}>
                    <SiteText id="dccbd6f5cbe8" fallback={"\u0418\u0437\u043e\u043b\u044f\u0446\u0438\u0438"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127657283000003"} data-elem-id={"1773127657283000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127887314000001"} data-elem-id={"1773127887314000001"} data-elem-type={"shape"}>
                  <InquiryButton className={"koruna-nolink tn-atom js-click-zero-stat"} target={"_blank"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127887314000002"} data-elem-id={"1773127887314000002"} data-elem-type={"shape"}>
                  <InquiryButton className={"koruna-nolink tn-atom js-click-zero-stat"} target={"_blank"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127887314000003"} data-elem-id={"1773127887314000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"}>
                    <InquiryButton className={"koruna-nolink"} target={"_blank"} style={{color: "inherit"}}>
                      {">"}
                    </InquiryButton>
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127887314000004"} data-elem-id={"1773127887314000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"}>
                    <InquiryButton className={"koruna-nolink"} target={"_blank"} style={{color: "inherit"}}>
                      <SiteText id="7b1b15a5e608" fallback={"\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0440\u0430\u0441\u0447\u0435\u0442"} />
                    </InquiryButton>
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127211967000004"} data-elem-id={"1773127211967000004"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127332923000009"} data-elem-id={"1773127332923000009"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127332923000009"}>
                    <SiteText id="3f1096b1eda2" fallback={"\u041c\u043e\u043d\u0442\u0430\u0436\u0430"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773127673369000004"} data-elem-id={"1773127673369000004"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773128161377"} data-elem-id={"1773128161377"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3830-3133-4164-b535-346436633463/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773128200329000001"} data-elem-id={"1773128200329000001"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3235-6262-4738-b331-393461373831/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773128208230000002"} data-elem-id={"1773128208230000002"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3063-6235-4932-a532-666338326366/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773128215095000003"} data-elem-id={"1773128215095000003"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6262-3265-4939-a139-663834613362/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20122611111773128223223000004"} data-elem-id={"1773128223223000004"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6630-3835-4165-a139-376365373635/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000131321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"121"} data-alias-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000131321"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2000131321"} />
              <div className={"t396__filter"} data-artboard-recid={"2000131321"} />
            </div>
          </div>
        </div>
        <div id={"rec2012318341"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2012318341"} data-artboard-screens={"320,960,1200"} data-artboard-height={"550"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"700"} data-artboard-height-res-960={"450"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2012318341"} />
                <div className={"t396__filter"} data-artboard-recid={"2012318341"} />
                <div className={"t396__elem tn-elem tn-elem__20123183411773128976193"} data-elem-id={"1773128976193"} data-elem-type={"shape"}>
                  <SiteBackground className={"tn-atom t-bgimg"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild6263-6539-4262-b331-633735653761/photo_2026-02-27_14-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20123183411773128990927000001"} data-elem-id={"1773128990927000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20123183411773129478463000001"} data-elem-id={"1773129478463000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20123183411773129338345000001"} data-elem-id={"1773129338345000001"} data-elem-type={"text"}>
                  <h2 className={"tn-atom"} field={"tn_text_1773129338345000001"}>
                    <SiteText id="ad31372ed6f4" fallback={"\u0426\u0435\u043d\u0430 \u043e\u043f\u0442\u0430 \u0434\u0430\u0436\u0435"} />
                    <br />
                    <SiteText id="e894743b83af" fallback={"\u043f\u0440\u0438 \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u043e\u043c \u043e\u0431\u044a\u0435\u043c\u0435"} />
                  </h2>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20123183411773129418343000001"} data-elem-id={"1773129418343000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773129418343000001"}>
                    <SiteText id="6ebbce1901e6" fallback={"\u0420\u0430\u0431\u043e\u0442\u0430\u0435\u043c \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0441 \u0437\u0430\u0432\u043e\u0434\u0430\u043c\u0438-\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f\u043c\u0438."} />
                    <br />
                    <SiteText id="12e234d6b2b7" fallback={"\u0414\u0435\u0440\u0436\u0438\u043c \u043a\u043e\u043d\u043a\u0443\u0440\u0435\u043d\u0442\u043d\u044b\u0435 \u0446\u0435\u043d\u044b \u0431\u0435\u0437 \u043d\u0430\u0446\u0435\u043d\u043e\u043a \u043f\u043e\u0441\u0440\u0435\u0434\u043d\u0438\u043a\u043e\u0432."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20123183411773129895328000003"} data-elem-id={"1773129895328000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773129895328000003"}>
                    <SiteText id="739ddd9bdea7" fallback={"\u041f\u041e\u0414\u0425\u041e\u0414\u0418\u0422 \u0414\u041b\u042f:"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20123183411773129720693000001"} data-elem-id={"1773129720693000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773129720693000001"}>
                    <ul>
                      <li data-list={"bullet"}>
                        <SiteText id="54a93f4e1481" fallback={"\u0427\u0430\u0441\u0442\u043d\u044b\u0445 \u0437\u0430\u0441\u0442\u0440\u043e\u0439\u0449\u0438\u043a\u043e\u0432"} />
                      </li>
                      <li data-list={"bullet"}>
                        <SiteText id="8e92523a1de5" fallback={"\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u0431\u0440\u0438\u0433\u0430\u0434"} />
                      </li>
                      <li data-list={"bullet"}>
                        <SiteText id="c794e6d5ebcf" fallback={"\u041f\u043e\u0434\u0440\u044f\u0434\u043d\u044b\u0445 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u0439"} />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000131321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"121"} data-alias-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000131321"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2000131321"} />
              <div className={"t396__filter"} data-artboard-recid={"2000131321"} />
            </div>
          </div>
        </div>
        <div id={"rec2012421821"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2012421821"} data-artboard-screens={"320,960,1200"} data-artboard-height={"161"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"158"} data-artboard-height-res-960={"118"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2012421821"} />
                <div className={"t396__filter"} data-artboard-recid={"2012421821"} />
                <div className={"t396__elem tn-elem tn-elem__20124218211773132119183000001"} data-elem-id={"1773132119183000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773132119183000001"}>
                    <SiteText id="68222e2c61bb" fallback={"\u0420\u0430\u0431\u043e\u0442\u0430\u0435\u043c \u043f\u043e \u0434\u043e\u0433\u043e\u0432\u043e\u0440\u0443. \u0412\u043e\u0437\u043c\u043e\u0436\u043d\u044b \u0440\u0435\u0433\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u043f\u043e\u0441\u0442\u0430\u0432\u043a\u0438 \u043d\u0430 \u043e\u0431\u044a\u0435\u043a\u0442\u044b."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124218211772767507761"} data-elem-id={"1772767507761"} data-elem-type={"text"}>
                  <h2 className={"tn-atom"} field={"tn_text_1772767507761"}>
                    <SiteText id="077256efa451" fallback={"\u0423\u0441\u043b\u043e\u0432\u0438\u044f \u0434\u043b\u044f \u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0439 \u0438 \u0431\u0440\u0438\u0433\u0430\u0434"} />
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2012426571"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2012426571"} data-artboard-screens={"320,960,1200"} data-artboard-height={"410"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"790"} data-artboard-height-res-960={"335"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2012426571"} />
                <div className={"t396__filter"} data-artboard-recid={"2012426571"} />
                <div className={"t396__elem tn-elem tn-elem__20124265711772769448786"} data-elem-id={"1772769448786"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772773766034"} data-elem-id={"1772773766034"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772773766034"}>
                    <SiteText id="0f9fc072c868" fallback={"\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u043c\u0435\u043d\u0435\u0434\u0436\u0435\u0440"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772775053407000001"} data-elem-id={"1772775053407000001"} data-elem-type={"shape"}>
                  <SiteBackground className={"tn-atom t-bgimg"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild6131-3064-4064-b533-383966343536/photo_2026-02-27_14-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772775062361000004"} data-elem-id={"1772775062361000004"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772775062362000007"} data-elem-id={"1772775062362000007"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772775875087000001"} data-elem-id={"1772775875087000001"} data-elem-type={"shape"}>
                  <SiteBackground className={"tn-atom t-bgimg"} aria-label={""} role={"img"} original={"/_thb.tildacdn.com/tild3562-3432-4362-b538-373535356438/-/resize/20x/photo_2026-02-27_14-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772775875088000005"} data-elem-id={"1772775875088000005"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772775875088000009"} data-elem-id={"1772775875088000009"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711772775875088000013"} data-elem-id={"1772775875088000013"} data-elem-type={"shape"}>
                  <SiteBackground className={"tn-atom t-bgimg"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild3231-6636-4331-a561-343037646462/photo_2026-02-27_14-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130694753000001"} data-elem-id={"1773130694753000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130694753000002"} data-elem-id={"1773130694753000002"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3830-3133-4164-b535-346436633463/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130779443000007"} data-elem-id={"1773130779443000007"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130779443000008"} data-elem-id={"1773130779443000008"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3830-3133-4164-b535-346436633463/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130790604000009"} data-elem-id={"1773130790604000009"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130790604000010"} data-elem-id={"1773130790604000010"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3830-3133-4164-b535-346436633463/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130716729000003"} data-elem-id={"1773130716729000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130716729000004"} data-elem-id={"1773130716729000004"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3830-3133-4164-b535-346436633463/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130761659000005"} data-elem-id={"1773130761659000005"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130761659000006"} data-elem-id={"1773130761659000006"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3830-3133-4164-b535-346436633463/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130418284000001"} data-elem-id={"1773130418284000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773130418284000001"}>
                    <SiteText id="05f8c4bd74cf" fallback={"\u0411\u044b\u0441\u0442\u0440\u0430\u044f"} />
                    <br />
                    <SiteText id="6f5c1f65b6d9" fallback={"\u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u044f \u0437\u0430\u043a\u0430\u0437\u0430"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130450778000002"} data-elem-id={"1773130450778000002"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773130450778000002"}>
                    <SiteText id="bb7b702d0c07" fallback={"\u0420\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u043e\u0432\u0430\u0440\u0430"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130500834000003"} data-elem-id={"1773130500834000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773130500834000003"}>
                    <SiteText id="595562ac4f03" fallback={"\u0421\u0442\u0430\u0431\u0438\u043b\u044c\u043d\u044b\u0435 \u0446\u0435\u043d\u044b"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773130535526000004"} data-elem-id={"1773130535526000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773130535526000004"}>
                    <SiteText id="a29d743934dc" fallback={"\u041e\u0442\u0433\u0440\u0443\u0437\u043a\u0430 \u0432 \u0434\u0435\u043d\u044c \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u044f"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773216221127"} data-elem-id={"1773216221127"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773216221127"}>
                    <SiteText id="5a78b6bf6bbc" fallback={"\u0417\u0430 \u0432\u0430\u043c\u0438 \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u044f\u0435\u0442\u0441\u044f \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0441\u0442, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u043f\u043e\u043c\u043e\u0433\u0430\u0435\u0442 \u0431\u044b\u0441\u0442\u0440\u043e \u043f\u043e\u0434\u043e\u0431\u0440\u0430\u0442\u044c \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b, \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044c \u043e\u0431\u044a\u0435\u043c \u0438 \u043e\u0444\u043e\u0440\u043c\u0438\u0442\u044c \u0437\u0430\u043a\u0430\u0437 \u0431\u0435\u0437 \u043b\u0438\u0448\u043d\u0438\u0445 \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u0439"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773216479790000003"} data-elem-id={"1773216479790000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773216479790000003"}>
                    <SiteText id="799b6f0182b5" fallback={"\u0414\u043b\u044f \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044e\u0442 \u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0438 \u0432\u044b\u0433\u043e\u0434\u043d\u044b\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f, \u0447\u0442\u043e \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u0437\u0430\u0440\u0430\u043d\u0435\u0435 \u043f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0431\u044e\u0434\u0436\u0435\u0442 \u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773216533018000004"} data-elem-id={"1773216533018000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773216533018000004"}>
                    <SiteText id="89b938397843" fallback={"\u0411\u043e\u043b\u044c\u0448\u0438\u043d\u0441\u0442\u0432\u043e \u043f\u043e\u0437\u0438\u0446\u0438\u0439 \u0435\u0441\u0442\u044c \u0432 \u043d\u0430\u043b\u0438\u0447\u0438\u0438 \u043d\u0430 \u0441\u043a\u043b\u0430\u0434\u0435 \u2014 \u043f\u0440\u0438 \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0438 \u0437\u0430\u043a\u0430\u0437\u0430 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u0430 \u043e\u0442\u0433\u0440\u0443\u0437\u043a\u0430 \u0432 \u0442\u043e\u0442 \u0436\u0435 \u0434\u0435\u043d\u044c."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773216298163000001"} data-elem-id={"1773216298163000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773216298163000001"}>
                    <SiteText id="91ce9b5f2ea4" fallback={"\u0421\u043e\u0431\u0438\u0440\u0430\u0435\u043c \u0437\u0430\u043a\u0430\u0437 \u043d\u0430 \u0441\u043a\u043b\u0430\u0434\u0435 \u0432 \u043a\u0440\u0430\u0442\u0447\u0430\u0439\u0448\u0438\u0435 \u0441\u0440\u043e\u043a\u0438, \u0447\u0442\u043e\u0431\u044b \u0432\u044b \u043c\u043e\u0433\u043b\u0438 \u0437\u0430\u0431\u0440\u0430\u0442\u044c \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0438\u043b\u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0438\u0445 \u043d\u0430 \u043e\u0431\u044a\u0435\u043a\u0442 \u0431\u0435\u0437 \u0437\u0430\u0434\u0435\u0440\u0436\u0435\u043a."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20124265711773216379241000002"} data-elem-id={"1773216379241000002"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773216379241000002"}>
                    <SiteText id="967bd21ca046" fallback={"\u0424\u0438\u043a\u0441\u0438\u0440\u0443\u0435\u043c \u043d\u0430\u043b\u0438\u0447\u0438\u0435 \u0442\u043e\u0432\u0430\u0440\u0430 \u043d\u0430 \u0441\u043a\u043b\u0430\u0434\u0435 \u043f\u043e\u0434 \u0432\u0430\u0448 \u043e\u0431\u044a\u0435\u043a\u0442, \u0447\u0442\u043e\u0431\u044b \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0431\u044b\u043b\u0438 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u0432 \u043d\u0443\u0436\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442."} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000131321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"121"} data-alias-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000131321"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2000131321"} />
              <div className={"t396__filter"} data-artboard-recid={"2000131321"} />
            </div>
          </div>
        </div>
        <div id={"rec2017025751"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2017025751"} data-artboard-screens={"320,960,1200"} data-artboard-height={"550"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"660"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2017025751"} />
                <div className={"t396__filter"} data-artboard-recid={"2017025751"} />
                <div className={"t396__elem tn-elem tn-elem__20170257511773210251760 "} data-elem-id={"1773210251760"} data-elem-type={"shape"} data-animate-sbs-event={"scroll"} data-animate-sbs-trg={"1"} data-animate-sbs-trgofst={"0"} data-animate-sbs-opts={"[{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'di':'0','dd':'0','fi':'0'},{'mx':0,'my':0,'sx':1.3,'sy':1.3,'op':1,'ro':0,'di':2000,'dd':'0','fi':'0'}]"}>
                  <SiteBackground className={"tn-atom t-bgimg"} aria-label={""} role={"img"} original={"/_thb.tildacdn.com/tild3736-6335-4837-b638-336332653361/-/resize/20x/photo_2026-03-11_13-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773210765065"} data-elem-id={"1773210765065"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773210757160"} data-elem-id={"1773210757160"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773210757160"}>
                    <SiteText id="09b922d8b587" fallback={"\u041d\u0430\u0434\u0435\u0436\u043d\u043e. "} />
                    <br />
                    <SiteText id="751d5a13da41" fallback={"\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u043e. \u041e\u043f\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u043e."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773211289497000001"} data-elem-id={"1773211289497000001"} data-elem-type={"text"}>
                  <h2 className={"tn-atom"} field={"tn_text_1773211289497000001"}>
                    <SiteText field="short" fallback={"\u0426\u0421\u0411"} />
                  </h2>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773210921215000001"} data-elem-id={"1773210921215000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773210921215000002"} data-elem-id={"1773210921215000002"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773210921215000002"}>
                    <SiteText id="30fdcb2b5b4d" fallback={"\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0432 \u0434\u0435\u043d\u044c \u0437\u0430\u043a\u0430\u0437\u0430 \u043f\u0440\u0438 \u043d\u0430\u043b\u0438\u0447\u0438\u0438 \u0442\u043e\u0432\u0430\u0440\u0430"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773210956839"} data-elem-id={"1773210956839"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773210956839"}>
                    <SiteText id="6babeda1a74c" fallback={"\u0421 2016 \u0433\u043e\u0434\u0430 \u043e\u043f\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u043e \u043f\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u043c \u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u043e\u0442 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439 \u043f\u043e \u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0443 \u0438 \u0440\u0435\u0433\u0438\u043e\u043d\u0430\u043c \u0421\u0438\u0431\u0438\u0440\u0441\u043a\u043e\u0433\u043e \u0424\u0435\u0434\u0435\u0440\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u043e\u043a\u0440\u0443\u0433\u0430."} />
                    <br />
                    <SiteText id="aa6c37b21ec6" fallback={"\u041e\u0444\u0438\u0441 \u0438 \u0441\u043a\u043b\u0430\u0434 \u043d\u0430\u0445\u043e\u0434\u044f\u0442\u0441\u044f \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435, \u0447\u0442\u043e \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u0431\u044b\u0441\u0442\u0440\u043e \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u043e\u0432\u0430\u0442\u044c \u0438 \u043e\u0442\u0433\u0440\u0443\u0436\u0430\u0442\u044c \u0437\u0430\u043a\u0430\u0437\u044b."} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773211125567"} data-elem-id={"1773211125567"} data-elem-type={"text"}>
                  <div className={"tn-atom"}>
                    <a href={"/o-kompanii"} style={{color: "inherit"}}>
                      <SiteText id="ee4d20ef8942" fallback={"\u041f\u041e\u0414\u0420\u041e\u0411\u041d\u0415\u0415"} />
                    </a>
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213036152"} data-elem-id={"1773213036152"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213079291000001"} data-elem-id={"1773213079291000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213079292000002"} data-elem-id={"1773213079292000002"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773213079292000002"}>
                    <SiteText id="da3041874e45" fallback={"\u0421\u0430\u043c\u043e\u0432\u044b\u0432\u043e\u0437:"} />
                    <br />
                    <SiteText field="address" fallback={"\u0433. \u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a, \u0443\u043b. \u041f\u0438\u0441\u0435\u043c\u0441\u043a\u043e\u0433\u043e 4\u043a1"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213079292000003"} data-elem-id={"1773213079292000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213121554000004"} data-elem-id={"1773213121554000004"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213133111000005"} data-elem-id={"1773213133111000005"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213133112000006"} data-elem-id={"1773213133112000006"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773213133112000006"}>
                    <SiteText id="be49adbdc7ff" fallback={"\u041f\u043e\u043b\u043d\u044b\u0439 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u0434\u043b\u044f \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u043b\u0438\u0446"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213133112000007"} data-elem-id={"1773213133112000007"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213133112000008"} data-elem-id={"1773213133112000008"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213141563000009"} data-elem-id={"1773213141563000009"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213223016000010"} data-elem-id={"1773213223016000010"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213223016000011"} data-elem-id={"1773213223016000011"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773213223016000011"}>
                    <SiteText id="766a47ab1ff8" fallback={"\u041d\u0430\u043b\u0438\u0447\u043d\u044b\u0439 \u0438 \u0431\u0435\u0437\u043d\u0430\u043b\u0438\u0447\u043d\u044b\u0439 \u0440\u0430\u0441\u0447\u0435\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213223016000012"} data-elem-id={"1773213223016000012"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213223016000013"} data-elem-id={"1773213223016000013"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213223016000014"} data-elem-id={"1773213223016000014"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20170257511773213232741000015"} data-elem-id={"1773213232741000015"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000131321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"121"} data-alias-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000131321"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2000131321"} />
              <div className={"t396__filter"} data-artboard-recid={"2000131321"} />
            </div>
          </div>
        </div>
        <div id={"rec2011953971"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2011953971"} data-artboard-screens={"320,960,1200"} data-artboard-height={"210"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"420"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2011953971"} />
                <div className={"t396__filter"} data-artboard-recid={"2011953971"} />
                <div className={"t396__elem tn-elem tn-elem__20119539711773123851291"} data-elem-id={"1773123851291"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20119539711773123964042"} data-elem-id={"1773123964042"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773123964042"}>
                    <SiteText id="3ce55672405b" fallback={"\u041d\u0443\u0436\u043d\u044b \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0434\u043b\u044f \u0441\u0442\u0440\u043e\u0439\u043a\u0438?"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20119539711773124014411000001"} data-elem-id={"1773124014411000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773124014411000001"}>
                    <SiteText id="b78bd88b02f9" fallback={"\u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443 \u043f\u0440\u044f\u043c\u043e \u0441\u0435\u0439\u0447\u0430\u0441 \u2014 \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u0438\u043c \u0440\u0430\u0441\u0447\u0435\u0442 \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u0438 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 15 \u043c\u0438\u043d\u0443\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20119539711773124059754000001"} data-elem-id={"1773124059754000001"} data-elem-type={"shape"}>
                  <InquiryButton className={"koruna-nolink tn-atom js-click-zero-stat"} target={"_blank"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20119539711773124059754000002"} data-elem-id={"1773124059754000002"} data-elem-type={"shape"}>
                  <InquiryButton className={"koruna-nolink tn-atom js-click-zero-stat"} target={"_blank"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20119539711773124059755000004"} data-elem-id={"1773124059755000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"}>
                    <InquiryButton className={"koruna-nolink"} target={"_blank"} style={{color: "inherit"}}>
                      {">"}
                    </InquiryButton>
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20119539711773124059754000003"} data-elem-id={"1773124059754000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"}>
                    <InquiryButton className={"koruna-nolink"} target={"_blank"} style={{color: "inherit"}}>
                      <SiteText id="7b1b15a5e608" fallback={"\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0440\u0430\u0441\u0447\u0435\u0442"} />
                    </InquiryButton>
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20119539711773124838346"} data-elem-id={"1773124838346"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_thb.tildacdn.com/tild3462-6636-4264-b065-363639366461/-/resize/20x/photo_2026-03-10_13-.png"} alt={""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2000131321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"121"} data-alias-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2000131321"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2000131321"} />
              <div className={"t396__filter"} data-artboard-recid={"2000131321"} />
            </div>
          </div>
        </div>
        <footer id={"t-footer"} className={"t-records"}>
          <div id={"rec2050529221"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
            <div className={"t396"}>
              <div className={"t396__artboard rendered"} data-artboard-recid={"2050529221"} data-artboard-screens={"320,960,1200"} data-artboard-height={"407"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"897"} data-artboard-height-res-960={"367"}>
                <div className={"csb-scale"}>
                  <div className={"t396__carrier"} data-artboard-recid={"2050529221"} />
                  <div className={"t396__filter"} data-artboard-recid={"2050529221"} />
                  <div className={"t396__elem tn-elem tn-elem__20505292211772780073423"} data-elem-id={"1772780073423"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1772780073423"}>
                      <SiteText id="4f34e26e4008" fallback={"\u041a\u0410\u0422\u0410\u041b\u041e\u0413"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113001733"} data-elem-id={"1773113001733"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/listovye-materialy"} style={{color: "inherit"}}>
                        <SiteText id="c6ebe619b086" fallback={"\u041b\u0438\u0441\u0442\u043e\u0432\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113054409000001"} data-elem-id={"1773113054409000001"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/uteplitel"} style={{color: "inherit"}}>
                        <SiteText id="b870b1bd42ad" fallback={"\u0423\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113074379000002"} data-elem-id={"1773113074379000002"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/polikarbonat"} style={{color: "inherit"}}>
                        <SiteText id="21134f5447bc" fallback={"\u041f\u043e\u043b\u0438\u043a\u0430\u0440\u0431\u043e\u043d\u0430\u0442"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113100596000003"} data-elem-id={"1773113100596000003"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/gidro-paroizolyaziya"} style={{color: "inherit"}}>
                        <SiteText id="fc2d94e3bc01" fallback={"\u0412\u0435\u0442\u0440\u043e- \u043f\u0430\u0440\u043e\u0438\u0437\u043e\u043b\u044f\u0446\u0438\u044f"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113124550000004"} data-elem-id={"1773113124550000004"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/profil-karkas"} style={{color: "inherit"}}>
                        <SiteText id="c28369e80e10" fallback={"\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0438 \u043a\u0430\u0440\u043a\u0430\u0441"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113140479000005"} data-elem-id={"1773113140479000005"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/montajnaya-himiya"} style={{color: "inherit"}}>
                        <SiteText id="bc52459052f3" fallback={"\u041c\u043e\u043d\u0442\u0430\u0436\u043d\u0430\u044f \u0445\u0438\u043c\u0438\u044f"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113160044000006"} data-elem-id={"1773113160044000006"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/krepej-i-metizy"} style={{color: "inherit"}}>
                        <SiteText id="4bccd875cfca" fallback={"\u041a\u0440\u0435\u043f\u0435\u0436 \u0438 \u043c\u0435\u0442\u0438\u0437\u044b"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113184148000007"} data-elem-id={"1773113184148000007"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/katalog/krovelnye-materialy"} style={{color: "inherit"}}>
                        <SiteText id="108a182dcc69" fallback={"\u041a\u0440\u043e\u0432\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113652728000002"} data-elem-id={"1773113652728000002"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773113652728000002"}>
                      <SiteText id="fdd81ccb4ff7" fallback={"\u041f\u041e\u041a\u0423\u041f\u0410\u0422\u0415\u041b\u042f\u041c"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113652729000003"} data-elem-id={"1773113652729000003"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/o-kompanii"} style={{color: "inherit"}}>
                        <SiteText id="febca7165473" fallback={"\u041e \u041a\u043e\u043c\u043f\u0430\u043d\u0438\u0438"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113652729000004"} data-elem-id={"1773113652729000004"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/oplata-i-dostavka"} style={{color: "inherit"}}>
                        <SiteText id="4156d0817d0f" fallback={"\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0438 \u043e\u043f\u043b\u0430\u0442\u0430"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113652729000005"} data-elem-id={"1773113652729000005"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/sotrudnichestvo"} style={{color: "inherit"}}>
                        <SiteText id="5a6da5b51fcb" fallback={"\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113652729000006"} data-elem-id={"1773113652729000006"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/contact"} style={{color: "inherit"}}>
                        <SiteText id="fca8d5aa3c1a" fallback={"\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113652729000007"} data-elem-id={"1773113652729000007"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/privacy"} style={{color: "inherit"}}>
                        <SiteText id="3ba8eaa5d624" fallback={"\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113652729000008"} data-elem-id={"1773113652729000008"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <a href={"/soglasie"} style={{color: "inherit"}}>
                        <SiteText id="205f97be66e6" fallback={"\u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435"} />
                      </a>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113838297000001"} data-elem-id={"1773113838297000001"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773113838297000001"}>
                      <SiteText id="98507e1ac8b9" fallback={"\u041a\u041e\u041c\u041f\u0410\u041d\u0418\u042f"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773114825100000001"} data-elem-id={"1773114825100000001"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773114825100000001"}>
                      <SiteText id="67d1c24c3a5b" fallback={"\u041a\u041e\u041d\u0422\u0410\u041a\u0422\u042b"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113838297000003"} data-elem-id={"1773113838297000003"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773113838297000003"}>
                      <SiteText field="legalFull" fallback={"\u0418\u041f \u0410\u0431\u0440\u0430\u043c\u043e\u0432 \u041c.\u0413."} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113838297000005"} data-elem-id={"1773113838297000005"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773113838297000005"}>
                      <SiteText field="inn" prefix={"\u0418\u041d\u041d "} suffix={""} fallback={"\u0418\u041d\u041d 540528687285"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113838297000006"} data-elem-id={"1773113838297000006"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773113838297000006"}>
                      <SiteText field="ogrn" prefix={"\u041e\u0413\u0420\u041d "} suffix={""} fallback={"\u041e\u0413\u0420\u041d 316547600180079"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773114586288000009"} data-elem-id={"1773114586288000009"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773114586288000009"}>
                      <SiteText id="b87e6ba86a55" fallback={"\u0410\u0434\u0440\u0435\u0441:"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773114630083000011"} data-elem-id={"1773114630083000011"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773114630083000011"}>
                      <SiteText id="a93113645cd7" fallback={"\u0420\u0435\u0436\u0438\u043c \u0440\u0430\u0431\u043e\u0442\u044b:"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773113838297000007"} data-elem-id={"1773113838297000007"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773113838297000007"}>
                      <SiteText field="address" fallback={"\u0433. \u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a \u0443\u043b. \u041f\u0438\u0441\u0435\u043c\u0441\u043a\u043e\u0433\u043e 4\u043a1"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773114612794000010"} data-elem-id={"1773114612794000010"} data-elem-type={"text"}>
                    <div className={"tn-atom"} field={"tn_text_1773114612794000010"}>
                      <SiteText field="warehouseHours" fallback={"Пн–Пт: 9:00–18:00, Сб–Вс: 9:00–15:00"} />
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773114869588"} data-elem-id={"1773114869588"} data-elem-type={"shape"}>
                    <SiteLink className={"tn-atom"} field="phone1" />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773114903474000001"} data-elem-id={"1773114903474000001"} data-elem-type={"shape"}>
                    <SiteLink className={"tn-atom"} field="phone1" />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115000780"} data-elem-id={"1773115000780"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <SiteLink field="phone1" style={{color: "inherit"}}>
                        <SiteText field="phone1" fallback={"+7 961-222-03-05"} />
                      </SiteLink>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115125147000001"} data-elem-id={"1773115125147000001"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <SiteLink field="phone1" style={{color: "inherit"}}>
                        {">"}
                      </SiteLink>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115338062000001"} data-elem-id={"1773115338062000001"} data-elem-type={"shape"}>
                    <SiteLink className={"tn-atom"} field="phone2" />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115338062000002"} data-elem-id={"1773115338062000002"} data-elem-type={"shape"}>
                    <SiteLink className={"tn-atom"} field="phone2" />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115338062000003"} data-elem-id={"1773115338062000003"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <SiteLink field="phone2" style={{color: "inherit"}}>
                        <SiteText field="phone2" fallback={"+7 383-255-55-99"} />
                      </SiteLink>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115338062000004"} data-elem-id={"1773115338062000004"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <SiteLink field="phone2" style={{color: "inherit"}}>
                        {">"}
                      </SiteLink>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115493122000001"} data-elem-id={"1773115493122000001"} data-elem-type={"shape"}>
                    <SiteLink className={"tn-atom"} field="email" />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115493123000002"} data-elem-id={"1773115493123000002"} data-elem-type={"shape"}>
                    <SiteLink className={"tn-atom"} field="email" />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115493123000003"} data-elem-id={"1773115493123000003"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <SiteLink field="email" target={"_blank"} style={{color: "inherit"}}>
                        <SiteText field="email" fallback={"info@reg-les.ru"} />
                      </SiteLink>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115493123000004"} data-elem-id={"1773115493123000004"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <SiteLink field="email" style={{color: "inherit"}}>
                        {">"}
                      </SiteLink>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115623110000005"} data-elem-id={"1773115623110000005"} data-elem-type={"shape"}>
                    <InquiryButton className={"koruna-nolink tn-atom"} />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115623110000006"} data-elem-id={"1773115623110000006"} data-elem-type={"shape"}>
                    <InquiryButton className={"koruna-nolink tn-atom"} />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115623110000007"} data-elem-id={"1773115623110000007"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <InquiryButton className={"koruna-nolink"} style={{color: "inherit"}}>
                        <SiteText id="acdd1e734125" fallback={"Telegram"} />
                      </InquiryButton>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115623110000008"} data-elem-id={"1773115623110000008"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <InquiryButton className={"koruna-nolink"} style={{color: "inherit"}}>
                        {">"}
                      </InquiryButton>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115676982000009"} data-elem-id={"1773115676982000009"} data-elem-type={"shape"}>
                    <InquiryButton className={"koruna-nolink tn-atom"} />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115676982000010"} data-elem-id={"1773115676982000010"} data-elem-type={"shape"}>
                    <InquiryButton className={"koruna-nolink tn-atom"} />
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115676982000011"} data-elem-id={"1773115676982000011"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <InquiryButton className={"koruna-nolink"} style={{color: "inherit"}}>
                        <SiteText id="a1a5936d3b0f" fallback={"Max"} />
                      </InquiryButton>
                    </div>
                  </div>
                  <div className={"t396__elem tn-elem tn-elem__20505292211773115676982000012"} data-elem-id={"1773115676982000012"} data-elem-type={"text"}>
                    <div className={"tn-atom"}>
                      <InquiryButton className={"koruna-nolink"} style={{color: "inherit"}}>
                        {">"}
                      </InquiryButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id={"rec2050529231"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"131"}>
            <div className={"t123"}>
              <div className={"t-container_100 "}>
                <div className={"t-width t-width_100 "} />
              </div>
            </div>
          </div>
          <div id={"rec2050529241"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"131"}>
            <div className={"t123"}>
              <div className={"t-container_100 "}>
                <div className={"t-width t-width_100 "} />
              </div>
            </div>
          </div>
          <div id={"rec2050635301"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"131"}>
            <div className={"t123"}>
              <div className={"t-container_100 "}>
                <div className={"t-width t-width_100 "} />
              </div>
            </div>
          </div>
          <div id={"rec2051080671"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"131"}>
            <div className={"t123"}>
              <div className={"t-container_100 "}>
                <div className={"t-width t-width_100 "} />
              </div>
            </div>
          </div>

          <div id={"rec2093177321"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"131"}>
            <div className={"t123"}>
              <div className={"t-container_100 "}>
                <div className={"t-width t-width_100 "} />
              </div>
            </div>
          </div>


        </footer>
      </div>
    </>
  )
}

import { SiteImage, SiteBackground } from '../../../site/SiteImage'
import { SiteText, SiteLink, InquiryButton } from '../../../site/SiteProvider'
import './design/page.css'
import { Brand } from '../../../brand/Brand'
import { MenuButton } from '../../../chrome/MenuButton'
import { CartCount } from '../../../cart/CartCount'
import { CatalogFill } from '../../../catalog/CatalogFill'

export function UteplitelPage() {
  return (
    <>
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-grid-3.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/ws/project22824286/tilda-blocks-page129873896.min.c369d01b43.css" />
      <link rel="stylesheet" href="/_fonts.googleapis.com/css2.bf76316f5c.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-popup-1.1.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-slds-1.4.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-catalog-1.2.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-forms-1.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-menusub-1.1.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-menu-widgeticons-1.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-menu-burger-1.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-cart-1.0.min.css" />
      <link rel="stylesheet" href="/_static.tildacdn.com/css/tilda-zoom-2.0.min.css" />
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
        <div id={"rec2084354381"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2084354381"} data-artboard-screens={"320,960,1200"} data-artboard-height={"310"} data-artboard-valign={"center"} data-artboard-upscale={"window"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2084354381"} />
                <div className={"t396__filter"} data-artboard-recid={"2084354381"} />
                <div className={"t396__elem tn-elem tn-elem__20843543811772697238325 "} data-elem-id={"1772697238325"} data-elem-type={"shape"} data-animate-sbs-event={"scroll"} data-animate-sbs-trg={"1"} data-animate-sbs-trgofst={"0"} data-animate-sbs-opts={"[{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'di':'0','dd':'0','fi':'0'},{'mx':0,'my':0,'sx':1.3,'sy':1.3,'op':1,'ro':0,'di':2000,'dd':'0','fi':'0'}]"}>
                  <SiteBackground className={"tn-atom t-bgimg"} aria-label={""} role={"img"} original={"/_static.tildacdn.com/tild3532-6563-4430-a538-316633373164/photo_2026-02-27_14-.jpg"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772766242264"} data-elem-id={"1772766242264"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772697320493"} data-elem-id={"1772697320493"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772697320493"}>
                    <SiteText id="b870b1bd42ad" fallback={"\u0423\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772763559813"} data-elem-id={"1772763559813"} data-elem-type={"text"}>
                  <h1 className={"tn-atom"} field={"tn_text_1772763559813"}>
                    <SiteText id="8115b9957269" fallback={"\u0423\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c \u043f\u043b\u0438\u0442\u043d\u044b\u0439, \u0440\u0443\u043b\u043e\u043d\u043d\u044b\u0439 \u043a\u0443\u043f\u0438\u0442\u044c \u0432 \u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0435 \u043e\u043f\u0442 \u2014 \u043e\u0442 1 \u0448\u0442\u0443\u043a\u0438"} />
                  </h1>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772763625159"} data-elem-id={"1772763625159"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765076864"} data-elem-id={"1772765076864"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765175997000002"} data-elem-id={"1772765175997000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765185502000003"} data-elem-id={"1772765185502000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765203983"} data-elem-id={"1772765203983"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765203983"}>
                    <SiteText id="136ced0acaf5" fallback={"\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0422\u041a \u043f\u043e \u0420\u0424"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765302499000004"} data-elem-id={"1772765302499000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765302499000004"}>
                    <SiteText id="08f66147c449" fallback={"\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e\u0435 \u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765469112000001"} data-elem-id={"1772765469112000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765469112000001"}>
                    <SiteText id="71c41c0b91ff" fallback={"\u0421\u043a\u043b\u0430\u0434 \u0432 \u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0435"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765512259000002"} data-elem-id={"1772765512259000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765512259000003"} data-elem-id={"1772765512259000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772765512259000003"}>
                    <SiteText id="4818a542aa83" fallback={"\u041f\u0440\u044f\u043c\u044b\u0435 \u043f\u043e\u0441\u0442\u0430\u0432\u043a\u0438"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765844655"} data-elem-id={"1772765844655"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3935-3634-4166-b834-396462666233/photo.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772765950999000001"} data-elem-id={"1772765950999000001"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3632-3532-4462-b630-393833343033/photo.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772766053215000002"} data-elem-id={"1772766053215000002"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6131-3161-4431-b834-363361336466/photo.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843543811772766164812000003"} data-elem-id={"1772766164812000003"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6164-3538-4231-b937-343463613764/photo.svg"} alt={""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2084354391"} className={"r t-rec t-rec_pt_30 t-rec_pt-res-480_30 t-rec_pb_30"} data-animationappear={"off"} data-record-type={"758"} data-bg-color={"#ffffff"} style={{paddingTop: "30px", paddingBottom: "30px", backgroundColor: "#ffffff"}}>
          <div className={"t758"}>
            <div className={"t-container"}>
              <div className={"t758__col t-col t-col_12 "}>
                <div className={"t758__wrapper t-align_center"}>
                  <ul className={"t758__list"}>
                    <li className={"t758__list_item"}>
                      <div className={"t758__link-item__wrapper"}>
                        <a className={"t-menu__link-item "} href={"/"}>
                          <SiteText id="a910510c56da" fallback={" \u0413\u043b\u0430\u0432\u043d\u0430\u044f "} />
                        </a>
                      </div>
                      <span className={"t758__breadcrumb-divider"}>
                        <SiteText id="8a5edab28263" fallback={"/"} />
                      </span>
                    </li>
                    <li className={"t758__list_item"}>
                      <div className={"t758__link-item__wrapper"}>
                        <a className={"t-menu__link-item "} href={"/katalog"}>
                          <SiteText id="d0ef3540b088" fallback={"\u041a\u0430\u0442\u0430\u043b\u043e\u0433"} />
                        </a>
                      </div>
                      <span className={"t758__breadcrumb-divider"}>
                        <SiteText id="8a5edab28263" fallback={"/"} />
                      </span>
                    </li>
                    <li className={"t758__list_item"}>
                      <div className={"t758__link-item__wrapper"}>
                        <div className={"t-menu__link-item t758__link-item_active"}>
                          <SiteText id="b870b1bd42ad" fallback={"\u0423\u0442\u0435\u043f\u043b\u0438\u0442\u0435\u043b\u044c"} />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2084354401"} className={"r t-rec t-rec_pt_0 t-rec_pb_0"} data-record-type={"976"} style={{paddingTop: "0px", paddingBottom: "0px"}}>
          <div className={"t-container"}>
            <div className={"t-col t-col_12 "}>
              <div className={"t976"} data-navmarker={"nav2084354401marker"} data-menu={"yes"}>
                <div className={"t976__wrapper t976__wrapper_aligncenter"}>
                  <div className={"t976__list-item"}>
                    <a className={"t976__menu-link t976__menu-link_small t-descr"} href={"/katalog/uteplitel"} data-menu-submenu-hook={""}>
                      <SiteText id="215816bf4210" fallback={"\u0412\u0441\u0435"} />
                    </a>
                  </div>
                  <div className={"t976__list-item"}>
                    <a className={"t976__menu-link t976__menu-link_small t-descr"} href={"/katalog/uteplitel/plitnyi"} data-menu-submenu-hook={""}>
                      <SiteText id="ad843cfbd24c" fallback={"\u041f\u043b\u0438\u0442\u043d\u044b\u0439"} />
                    </a>
                  </div>
                  <div className={"t976__list-item"}>
                    <a className={"t976__menu-link t976__menu-link_small t-descr"} href={"/katalog/uteplitel/rulonnyi"} data-menu-submenu-hook={""}>
                      <SiteText id="69158f9d37a9" fallback={"\u0420\u0443\u043b\u043e\u043d\u043d\u044b\u0439"} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec-koruna-catalog"} className={"r t-rec koruna-rec"} data-record-type={"koruna"}>
          <CatalogFill mode="category" slug="uteplitel" />
        </div>
        <div id={"rec2084354421"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2084354421"} data-artboard-screens={"320,960,1200"} data-artboard-height={"120"} data-artboard-valign={"center"} data-artboard-upscale={"grid"} data-artboard-height-res-320={"80"} data-artboard-height-res-960={"100"}>
              <div className={"t396__carrier"} data-artboard-recid={"2084354421"} />
              <div className={"t396__filter"} data-artboard-recid={"2084354421"} />
            </div>
          </div>
        </div>
        <div id={"rec2084354431"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2084354431"} data-artboard-screens={"320,960,1200"} data-artboard-height={"218"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"288"} data-artboard-height-res-960={"188"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2084354431"} />
                <div className={"t396__filter"} data-artboard-recid={"2084354431"} />
                <div className={"t396__elem tn-elem tn-elem__20843544311772767507761"} data-elem-id={"1772767507761"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1772767507761"}>
                    <SiteText id="e38a3ad9044b" fallback={"\u0417\u0430\u043a\u0440\u043e\u0439\u0442\u0435 \u0432\u0441\u0435 \u044d\u0442\u0430\u043f\u044b \u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127169759000001"} data-elem-id={"1773127169759000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127169759000001"}>
                    <SiteText id="4cfb55b24b48" fallback={"\u041f\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u043c \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0434\u043b\u044f:"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127223845000005"} data-elem-id={"1773127223845000005"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127263835"} data-elem-id={"1773127263835"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127263835"}>
                    <SiteText id="59ff978b0192" fallback={"\u041a\u0430\u0440\u043a\u0430\u0441\u043d\u044b\u0445 \u0440\u0430\u0431\u043e\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127472180"} data-elem-id={"1773127472180"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127116794"} data-elem-id={"1773127116794"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127290594000006"} data-elem-id={"1773127290594000006"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127290594000006"}>
                    <SiteText id="36a515089261" fallback={"\u0423\u0442\u0435\u043f\u043b\u0435\u043d\u0438\u044f"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127616291000001"} data-elem-id={"1773127616291000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127204169000002"} data-elem-id={"1773127204169000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127309432000007"} data-elem-id={"1773127309432000007"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127309432000007"}>
                    <SiteText id="0fa3d7a0284d" fallback={"\u041e\u0431\u0448\u0438\u0432\u043a\u0438"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127637417000002"} data-elem-id={"1773127637417000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127208158000003"} data-elem-id={"1773127208158000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127319244000008"} data-elem-id={"1773127319244000008"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127319244000008"}>
                    <SiteText id="dccbd6f5cbe8" fallback={"\u0418\u0437\u043e\u043b\u044f\u0446\u0438\u0438"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127657283000003"} data-elem-id={"1773127657283000003"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127887314000001"} data-elem-id={"1773127887314000001"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127887314000002"} data-elem-id={"1773127887314000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127887314000003"} data-elem-id={"1773127887314000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127887314000003"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127887314000004"} data-elem-id={"1773127887314000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127887314000004"}>
                    <SiteText id="7b1b15a5e608" fallback={"\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0440\u0430\u0441\u0447\u0435\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127211967000004"} data-elem-id={"1773127211967000004"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127332923000009"} data-elem-id={"1773127332923000009"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773127332923000009"}>
                    <SiteText id="3f1096b1eda2" fallback={"\u041c\u043e\u043d\u0442\u0430\u0436\u0430"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773127673369000004"} data-elem-id={"1773127673369000004"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773128161377"} data-elem-id={"1773128161377"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3830-3133-4164-b535-346436633463/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773128200329000001"} data-elem-id={"1773128200329000001"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3235-6262-4738-b331-393461373831/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773128208230000002"} data-elem-id={"1773128208230000002"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild3063-6235-4932-a532-666338326366/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773128215095000003"} data-elem-id={"1773128215095000003"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6262-3265-4939-a139-663834613362/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544311773128223223000004"} data-elem-id={"1773128223223000004"} data-elem-type={"image"}>
                  <div className={"tn-atom"}>
                    <SiteImage className={"tn-atom__img t-img"} src={"/_static.tildacdn.com/tild6630-3835-4165-a139-376365373635/kontrolnaya_otmetka_.svg"} alt={""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id={"rec2084354441"} className={"r t-rec"} data-animationappear={"off"} data-record-type={"396"}>
          <div className={"t396"}>
            <div className={"t396__artboard rendered"} data-artboard-recid={"2084354441"} data-artboard-screens={"320,960,1200"} data-artboard-height={"210"} data-artboard-valign={"center"} data-artboard-upscale={"window"} data-artboard-height-res-320={"420"}>
              <div className={"csb-scale"}>
                <div className={"t396__carrier"} data-artboard-recid={"2084354441"} />
                <div className={"t396__filter"} data-artboard-recid={"2084354441"} />
                <div className={"t396__elem tn-elem tn-elem__20843544411773123851291"} data-elem-id={"1773123851291"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544411773123964042"} data-elem-id={"1773123964042"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773123964042"}>
                    <SiteText id="3ce55672405b" fallback={"\u041d\u0443\u0436\u043d\u044b \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0434\u043b\u044f \u0441\u0442\u0440\u043e\u0439\u043a\u0438?"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544411773124014411000001"} data-elem-id={"1773124014411000001"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773124014411000001"}>
                    <SiteText id="b78bd88b02f9" fallback={"\u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443 \u043f\u0440\u044f\u043c\u043e \u0441\u0435\u0439\u0447\u0430\u0441 \u2014 \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u0438\u043c \u0440\u0430\u0441\u0447\u0435\u0442 \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u0438 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 15 \u043c\u0438\u043d\u0443\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544411773124059754000001"} data-elem-id={"1773124059754000001"} data-elem-type={"shape"}>
                  <InquiryButton className={"koruna-nolink tn-atom js-click-zero-stat"} target={"_blank"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544411773124059754000002"} data-elem-id={"1773124059754000002"} data-elem-type={"shape"}>
                  <div className={"tn-atom"} />
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544411773124059755000004"} data-elem-id={"1773124059755000004"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773124059755000004"}>
                    {">"}
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544411773124059754000003"} data-elem-id={"1773124059754000003"} data-elem-type={"text"}>
                  <div className={"tn-atom"} field={"tn_text_1773124059754000003"}>
                    <SiteText id="7b1b15a5e608" fallback={"\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0440\u0430\u0441\u0447\u0435\u0442"} />
                  </div>
                </div>
                <div className={"t396__elem tn-elem tn-elem__20843544411773124838346"} data-elem-id={"1773124838346"} data-elem-type={"image"}>
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

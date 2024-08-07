import React, { forwardRef } from "react";
import "./index.css";

const Footer = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="bg-[#efefef] text-stone-950 w-[100vw] p-12 h-auto mt-auto z-20"
    >
      <footer class="footer-olm mt-4">
        <div class="footer-top">
          <div class="container">
            <div class="inner-content">
              <div class="row flex gap-5">
                <div class="col-lg-6 col-md-4 col-sm-6 col-12">
                  <div class="footer-widget f-about">
                    <div class="logo">
                      <a href="https://olm.vn/gioi-thieu">
                        <img
                          data-src="https://rs.olm.vn/tentant/landingpage/assets/images/olm-logo.png?v=1722872169"
                          width="122"
                          height="45"
                          alt="OLM Logo"
                          title="Logo"
                          class="img-fluid lazyloaded"
                          src="https://rs.olm.vn/tentant/landingpage/assets/images/olm-logo.png?v=1722872169"
                        />
                      </a>
                    </div>
                    <p>
                      OLM là nền tảng giáo dục số. Với chương trình giảng dạy
                      bám sát sách giáo khoa từ mẫu giáo đến lớp 12. Các bài học
                      được cá nhân hoá và phân tích thời gian thực. OLM đáp ứng
                      nhu cầu riêng của từng người học.
                    </p>
                    <p>
                      Theo dõi OLM trên
                      <a
                        aria-label="Facebook"
                        class="social-lk"
                        className="ml-3"
                        href="https://www.facebook.com/profile.php?id=61560611572478"
                        target="_blank"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title=""
                        data-original-title="Fanpage"
                      >
                        <img
                          alt="Facebook"
                          title="Facebook"
                          class="lk ls-is-cached lazyloaded"
                          data-src="https://rs.olm.vn/images/facebook-icon.svg?v=1722872169"
                          src="https://rs.olm.vn/images/facebook-icon.svg?v=1722872169"
                        />
                      </a>
                    </p>
                    <p class="copyright-text">
                      <span>© 2024</span> hotrotinhoc18@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex md:gap-9 sm:gap-2">
                  <div class="col-lg-2 col-md-3 col-sm-6 col-12">
                    <div class="footer-widget f-link">
                      <h5>Chúng tôi đề xuất</h5>
                      <ul>
                        <li>
                          <a
                            href="https://www.facebook.com/profile.php?id=61560611572478"
                            title="Giới thiệu"
                          >
                            Về OLM
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.facebook.com/profile.php?id=61560611572478"
                            title="Dành cho HS &amp; PHHS"
                          >
                            Dành cho HS &amp; PHHS
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://olm.vn/gioi-thieu/giao-vien-va-nha-truong"
                            title="Dành cho GV và Nhà trường"
                          >
                            Dành cho GV và Nhà trường
                          </a>
                        </li>
                        <li>
                          <a href="#" title="app phụ huynh">
                            APP Phụ huynh
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-lg-2 col-md-3 col-sm-6 col-12">
                    <div class="footer-widget f-link">
                      <h5>Tài nguyên</h5>
                      <ul>
                        <li>
                          <a
                            href="https://olm.vn/gioi-thieu/trung-tam-tro-giup"
                            title="Trung tâm trợ giúp"
                          >
                            Trung tâm trợ giúp
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://olm.vn/gioi-thieu/docs"
                            title="Hướng dẫn sử dụng"
                          >
                            Hướng dẫn sử dụng
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://olm.vn/gioi-thieu/feedback"
                            title="Nói với chúng tôi cái bạn nghĩ"
                          >
                            Phản hồi với OLM
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://olm.vn/gioi-thieu/phan-hoi-khach-hang"
                            title="Phản hồi khách hàng"
                          >
                            KH nói về OLM
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://olm.vn/gioi-thieu/lien-he"
                            title="Liên hệ"
                          >
                            Liên hệ
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* <div class="col-lg-2 col-md-2 col-sm-6 col-12">
                  <div class="footer-widget f-link">
                    <h5>Ứng dụng mobile</h5>
                    <a
                      href="https://apps.apple.com/vn/app/olm/id6497209326?l=vi"
                      target="_blank"
                      title="Tải ứng dụng trên App Store"
                      data-tracking-id="app-store"
                    >
                      <img
                        data-src="/images/footer-store-app.png?v=1722872169"
                        width="150"
                        height="45"
                        title="OLM trên App Store"
                        class="img-fluid lazyloaded"
                        src="/images/footer-store-app.png?v=1722872169"
                      />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=vn.olm.olmapp"
                      target="_blank"
                      title="Tải ứng dụng OLM trên Google Play"
                      data-tracking-id="google-play"
                    >
                      <img
                        data-src="/images/footer-google-app.png?v=1722872169"
                        width="150"
                        height="45"
                        title="OLM trên Google Play"
                        class="img-fluid mt-2 lazyloaded"
                        src="/images/footer-google-app.png?v=1722872169"
                      />
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default Footer;

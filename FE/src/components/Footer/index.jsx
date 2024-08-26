import React, { forwardRef } from "react";
import "./index.css";
import logo from "../../assets/THV1.svg";

const Footer = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="bg-[#e0e0e0] text-[#1976D2] p-12 h-auto mt-auto z-40 w-full">
      <footer class="footer-olm mt-4">
        <div class="footer-top">
          <a href="https://www.facebook.com/people/SIE18/61562449373390/?notif_id=1721581073983834&notif_t=page_user_activity&ref=notif">
            <img
              width="250"
              height="100"
              alt="THV Logo"
              title="Logo"
              class="img-fluid lazyloaded"
              src={logo}
            />
          </a>
          <div class="container">
            <div class="inner-content">
              <div class="row flex gap-5">
                <div class="col-lg-6 col-md-4 col-sm-6 col-12">
                  <div class="footer-widget f-about">
                    <div class="logo"></div>
                    <p>
                      TIN HOC VUI là nền tảng giáo dục Tin Học sáng tạo, cung
                      cấp bài học tương tác và tài liệu học tập phong phú. Hướng
                      đến sự phát triển toàn diện cho học sinh và hỗ trợ hiệu
                      quả cho giáo viên, TIN HOC VUI mang đến trải nghiệm học
                      tập thú vị và hiệu quả.
                    </p>
                    <p>
                      Theo dõi TNV trên
                      <a
                        aria-label="Facebook"
                        class="social-lk"
                        className="ml-3"
                        href="https://www.facebook.com/people/SIE18/61562449373390/?notif_id=1721581073983834&notif_t=page_user_activity&ref=notif"
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
                            Về TNV
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
                             href="#"
                            title="Trung tâm trợ giúp"
                          >
                            Trung tâm trợ giúp
                          </a>
                        </li>
                        <li>
                          <a
                           href="#"
                            title="Hướng dẫn sử dụng"
                          >
                            Hướng dẫn sử dụng
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            title="Nói với chúng tôi cái bạn nghĩ"
                          >
                            Phản hồi với TNV
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            title="Phản hồi khách hàng"
                          >
                            KH nói về TNV
                          </a>
                        </li>
                        <li>
                          <a
                          href="#"
                            title="Liên hệ"
                          >
                            Liên hệ
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default Footer;

import React, { forwardRef } from "react";
import "./index.css";

const Footer = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="bg-[#efefef] text-stone-950 w-[100vw] p-12 h-auto mt-auto z-20"
    >
      {/* <h1 className="font-semibold text-xl text-center mb-10">Liên hệ</h1> */}
      {/* <div className="flex items-center justify-center flex-wrap gap-20">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-4 h-4" // Example: Adjust width and height as needed
            fill="currentColor"
          >
            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
          </svg>
          <h1 className="italic-underline">0987654321</h1>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-4 h-4" // Example: Adjust width and height as needed
            fill="currentColor"
          >
            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
          </svg>
          <h1 className="italic-underline">contact.info@gmail.com</h1>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="w-4 h-4" // Example: Adjust width and height as needed
            fill="currentColor"
          >
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
          </svg>
          <h1 className="italic-underline">
            156 Nguyễn Đổng Chi, Quận Nam Từ Liêm, Hà Nội
          </h1>
        </div>
      </div> */}
      {/* <div className="flex">
        <div className="w-[50vw] border-2">
    
          <p></p>
          <p>
            OLM là nền tảng giáo dục số. Với chương trình giảng dạy bám sát sách
            giáo khoa từ mẫu giáo đến lớp 12. Các bài học được cá nhân hoá và
            phân tích thời gian thực. OLM đáp ứng nhu cầu riêng của từng người
            học.
          </p>
          <p className="flex items-center gap-2">
            <span className="text-xl text-stone-800"> Theo dõi OLM trên:</span>
            <img
              src="https://rs.olm.vn/images/facebook-icon.svg?v=1722872169"
              width={30}
              height={30}
            />
          </p>
          <p>© 2013 - 2024 OLM.VN (26) - Email: a@olm.vn</p>

        </div>
        <div className="w-[25vw] border-2"></div>
        <div className="w-[25vw] border-2"></div>
      </div> */}
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

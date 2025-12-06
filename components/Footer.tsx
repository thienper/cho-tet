'use client';

import { FaEnvelope, FaFacebook, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

export default function Footer() {
    return (
        <footer className="footer-tet">
            <div className="footer-pattern"></div>

            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">🧧 Tết Market</h3>
                        <p className="footer-desc">
                            Chuyên cung cấp hàng Tết chất lượng cao, mang đến sự ấm áp và may mắn cho gia đình bạn.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Liên Hệ</h3>
                        <ul className="footer-links">
                            <li>
                                <FaPhone /> Hotline: 0974122850
                            </li>
                            <li>
                                <FaEnvelope /> Email: thienper@gmail.com
                            </li>
                            <li>
                                <FaMapMarkerAlt /> Địa chỉ: 497 Phan Văn Trị, Gò Vấp
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Kết Nối Với Chúng Tôi</h3>
                        <div className="social-links">
                            <a href="https://www.facebook.com/thienperr" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                                <FaFacebook /> Facebook
                            </a>
                            <a href="http://zaloapp.com/qr/p/kuhf5gyvg7sw" target="_blank" rel="noopener noreferrer" className="social-btn zalo">
                                <SiZalo /> Zalo
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Giờ Làm Việc</h3>
                        <ul className="footer-links">
                            <li>Thứ 2 - Thứ 6: 8:00 - 20:00</li>
                            <li>Thứ 7 - Chủ Nhật: 8:00 - 22:00</li>
                            <li>Tết Nguyên Đán: 24/7</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Tết Market. Chúc mừng năm mới - Vạn sự như ý!</p>
                </div>
            </div>
        </footer>
    );
}

import {
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-[#f9f9f9ff] py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-6">
            <span className="text-3xl font-bold text-white tracking-tighter">
              CLISA
            </span>
            <p className="text-sm mt-3 text-[#f9f9f9ff]">
              CLISA leverages cutting-edge technology to provide precise flood
              modeling solutions, helping communities and organizations better
              prepare for and respond to flooding events.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">SOLUTIONS</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Hydrological Modeling
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Flood Risk Assessment
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Impact Analysis
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">RESOURCES</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  White Papers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-xs text-[#f9f9f9ff]">
            © 2024 CLISA.com - All rights reserved
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <Link
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              Facebook
            </Link>
            <Link
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

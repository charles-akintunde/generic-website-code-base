import {
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';

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
              Create, distribute, and monetize your podcast – all for free.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">STACK OVERFLOW</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Questions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Help
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Chat
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">PRODUCTS</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Teams
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Advertising
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Talent
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Work Here
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
                >
                  Legal
                </a>
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
            <a
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              Blog
            </a>
            <a
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              Facebook
            </a>
            <a
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              Twitter
            </a>
            <a
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              Instagram
            </a>
            <a
              href="#"
              className="inline-block transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

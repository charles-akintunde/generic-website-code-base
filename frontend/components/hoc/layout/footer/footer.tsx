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
    <footer className="">
      <div className="bg-gray-900 text-[#f9f9f9ff] py-8">
        <div className="container mx-auto px-6 md:flex md:justify-between md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white tracking-tighter">
                CLISA
              </span>
            </div>
            <p className="text-sm mt-3 max-w-sm text-[#f9f9f9ff]">
              Create, distribute, and monetize your podcast – all for free.
            </p>
          </div>

          <div className="flex flex-wrap gap-16">
            <div>
              <h4 className="font-medium text-white mb-3">Service</h4>
              <ul className="space-y-2">
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="#">About Us</a>
                </li>
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="#">Contact Us</a>
                </li>
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="/teams">Team</a>
                </li>
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="#">Blog</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="#">Apps</a>
                </li>
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="#">Developer</a>
                </li>
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="#">Integration</a>
                </li>
                <li className="relative transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <a href="#">Pricing</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <MailOutlined className="mr-3" /> CLISA@gmail.co
                </li>
                <li className="flex items-center transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white">
                  <PhoneOutlined className="mr-3" /> +1 (202) 931-4526
                </li>
              </ul>
              <div className="flex mt-4 space-x-4">
                <a
                  href="#"
                  className="text-[#f9f9f9ff] transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white"
                >
                  <FacebookOutlined className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="text-[#f9f9f9ff] transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white"
                >
                  <TwitterOutlined className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="text-[#f9f9f9ff] transition-all duration-100 ease-in-out hover:border-b-2 hover:border-white"
                >
                  <InstagramOutlined className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="text-center text-[#f9f9f9ff] text-xs mt-8">
          © 2024 CLISA.com - All rights reserved
        </div>
      </div>
    </footer>
  );
}

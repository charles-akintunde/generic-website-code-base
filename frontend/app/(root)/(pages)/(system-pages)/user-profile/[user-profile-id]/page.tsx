import React from 'react';
import UserProfileForm from '@/components/common/form/user-profile-form';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import {
  containerNoFlexPaddingStyles,
  pageContentPaddingStyles,
} from '@/styles/globals';

const UserProfilePage = () => {
  return (
    <div className={`${pageContentPaddingStyles} mt-10`}>
      <div className="flex flex-col">
        {/* Left Section */}
        <div className="bg-white sticky top-30 z-20 flex flex-col items-center">
          <img
            src="https://localhost:8443/static/images/thumbnails/92953722_820756251748397_6669410420513570816_n***a2875094-eae5-4501-85a8-0035cb9be69d.webp" // replace with the actual image path
            alt="User Avatar"
            className="w-24 h-24 rounded-full shadow-lg"
          />
          <p className="mt-4 text-lg font-semibold text-gray-800">
            cameronwilliamson@hotmail.com
          </p>
          <p className="text-sm text-gray-500">Last sign in: 16 minutes ago</p>
          <div className="mt-4 flex flex-col w-full"></div>
        </div>

        {/* Right Section */}
        <div className="">
          <div className="bg-white p-6 rounded-lg  border-2 border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Personal Information
            </h2>
            <UserProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

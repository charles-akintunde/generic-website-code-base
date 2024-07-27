import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pg p-4">
      <header className="w-full max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Generic Code Base
        </h1>
        <p className="text-xl text-gray-600">
          Quickly customizable templates for faster website development.
        </p>
      </header>
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Customizable Templates
          </h2>
          <p className="text-gray-600">
            Choose from a variety of templates that can be easily tailored to
            your needs.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Fast Implementation
          </h2>
          <p className="text-gray-600">
            Implement your website quickly with pre-built components and
            modules.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Comprehensive Documentation
          </h2>
          <p className="text-gray-600">
            Access detailed guides and references to help you customize your
            website.
          </p>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto mt-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Get Started in Minutes
        </h2>
        <button className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition">
          Start Building
        </button>
      </section>
      <footer className="w-full max-w-6xl mx-auto text-center mt-12">
        <p className="text-gray-600">
          &copy; 2024 Generic Code Base. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

export default function Footer() {
  return (
    <footer className="bg-pg text-black py-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center mb-4">
          <a href="#" className="mx-4 hover:text-gray-600">
            Home
          </a>
          <a href="#" className=" mx-4 hover:text-gray-600">
            Teams
          </a>
          <a href="#" className="mx-4 hover:text-gray-600">
            About Us
          </a>
          <a href="#" className="mx-4 hover:text-gray-600">
            News
          </a>
        </div>
        <p className="text-xs">
          &copy; 2024 Generic Codebase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

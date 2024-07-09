"use client";

export default function Footer() {
  return (
    <div>
      <div className="mt-8 bg-gray-200 dark:bg-gray-700">
        <div className="container">
          <div className="py-8 sm:grid gap-4 sm:grid-cols-2 md:grid-cols-4 ">
            <div>
              <h1 className="mb-4 font-semibold">Help</h1>
              <p className="cursor-pointer hover:underline text-sm">
                Help center
              </p>
              <p className="cursor-pointer hover:underline text-sm">FAQs</p>
              <p className="cursor-pointer hover:underline text-sm">
                Privacy policy
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                Cookie policy
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                Terms of use
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                Manage cookie settings
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                Content guidelines & reporting
              </p>
            </div>
            <div>
              <h1 className="mb-4 font-semibold">Company</h1>
              <p className="cursor-pointer hover:underline text-sm">About us</p>
              <p className="cursor-pointer hover:underline text-sm">Careers</p>
              <p className="cursor-pointer hover:underline text-sm">Blog</p>
            </div>
            <div>
              <h1 className="mb-4 font-semibold">Destinations</h1>
              <p className="cursor-pointer hover:underline text-sm">
                Countries/Territories
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                All Flight Routes
              </p>
            </div>
            <div>
              <h1 className="mb-4 font-semibold">Partner with us</h1>
              <p className="cursor-pointer hover:underline text-sm">
                Partner Hub
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                Advertise on sleep at
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                Affiliates
              </p>
              <p className="cursor-pointer hover:underline text-sm">
                Sleep at API Documentation
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-700 dark:bg-gray-900 text-white">
        <div className="container  h-24 flex flex-col justify-center items-center">
          <p className="text-center"> © 2024 Sleepat Company Pte. Ltd. All Rights Reserved.</p>
          <p>Created by itsAboo</p>
        </div>
      </div>
    </div>
  );
}

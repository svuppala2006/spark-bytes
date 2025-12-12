// // app/about/page.tsx
// import React from 'react';
// export default function AboutPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       <nav className="bg-[#8C1515] shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="text-white font-bold text-xl">TerrierBytes</div>
//             <div className="flex space-x-8">
//               <a href="/" className="text-white hover:text-yellow-300 transition-colors">Home</a>
//               <a href="/search" className="text-white hover:text-yellow-300 transition-colors">Search</a>
//               <a href="/food" className="text-white hover:text-yellow-300 transition-colors">Food</a>
//               <a href="/about" className="text-yellow-300 font-semibold">About</a>
//             </div>
//             <div className="text-white text-sm">user@bu.edu</div>
//           </div>
//         </div>
//       </nav>

//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
//         <h1 className="text-5xl font-bold text-[#8C1515] mb-4">About TerrierBytes</h1>
//         <p className="text-xl text-gray-600 max-w-2xl mx-auto">Reducing food waste.</p>
//       </div>

//       {/* Our Goals Section */}
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <div className="flex items-center space-x-6">
//             <div className="bg-[#8C1515] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl">
//               ♻️
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold text-[#8C1515] mb-4">Our Goals</h2>
//               <p className="text-lg text-gray-700 leading-relaxed">
//                 To connect the BU community with surplus food from campus events, reducing waste 
//                 and promoting sustainability through technology and community engagement.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <h2 className="text-4xl font-bold text-[#8C1515] text-center mb-12">How It Works</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Step 1 */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform">
//             <div className="bg-yellow-400 text-[#8C1515] w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
//               🔍
//             </div>
//             <h3 className="text-2xl font-bold text-[#8C1515] mb-4">Find Events</h3>
//             <p className="text-gray-600 leading-relaxed">
//               Browse upcoming events with available surplus food on campus using our search platform.
//             </p>
//           </div>

//           {/* Step 2 */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform">
//             <div className="bg-yellow-400 text-[#8C1515] w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
//               📦
//             </div>
//             <h3 className="text-2xl font-bold text-[#8C1515] mb-4">Pick Up Food</h3>
//             <p className="text-gray-600 leading-relaxed">
//               Claim available food items and pick them up at the specified event location and time.
//             </p>
//           </div>

//           {/* Step 3 */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform">
//             <div className="bg-yellow-400 text-[#8C1515] w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
//               🌱
//             </div>
//             <h3 className="text-2xl font-bold text-[#8C1515] mb-4">Reduce Waste</h3>
//             <p className="text-gray-600 leading-relaxed">
//               Enjoy delicious food while helping BU reduce its environmental footprint and food waste.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Meet the Team Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <h2 className="text-4xl font-bold text-[#8C1515] text-center mb-12">Meet the Team</h2>
//         <div className="flex justify-center space-x-8">
//           {/* Team Member 1 */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-64">
//             <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 text-sm">
//               Profile Image
//             </div>
//             <h3 className="text-xl font-bold text-[#8C1515] mb-2">Team Member 1</h3>
//             <p className="text-gray-600">Developer</p>
//           </div>

//           {/* Team Member 2 */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-64">
//             <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 text-sm">
//               Profile Image
//             </div>
//             <h3 className="text-xl font-bold text-[#8C1515] mb-2">Team Member 2</h3>
//             <p className="text-gray-600">Designer</p>
//           </div>

//           {/* Team Member 3 */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-64">
//             <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 text-sm">
//               Profile Image
//             </div>
//             <h3 className="text-xl font-bold text-[#8C1515] mb-2">Team Member 3</h3>
//             <p className="text-gray-600">Project Manager</p>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-[#8C1515] text-white py-8 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <p>© 2025 TerrierBytes | Boston University</p>
//         </div>
//       </footer>
//     </div>
//   );
// }
// app/about/page.tsx
import React from 'react';
import Image from 'next/image';

// LinkedIn Icon Component - Official style
const LinkedInIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Blue background rounded square */}
    <rect width="72" height="72" rx="8" fill="#0A66C2"/>

    {/* White "in" letters */}
    {/* Letter "i" - dot */}
    <circle cx="21" cy="21" r="5" fill="white"/>

    {/* Letter "i" - vertical line */}
    <rect x="16" y="30" width="10" height="28" rx="2" fill="white"/>

    {/* Letter "n" */}
    <path
      d="M32 30h10v3.5c2-2.5 5-4 8.5-4 8.5 0 11.5 5.5 11.5 13V58H52V43.5c0-4-1.5-7.5-5.5-7.5S42 39 42 43.5V58H32V30z"
      fill="white"
    />
  </svg>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16"> {/* 添加 pt-16 来给全局navbar留出空间 */}
      {/* 删除了自定义的导航栏 */}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-[#8C1515] mb-4">About Spark!Bytes</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Reducing food waste.</p>
      </div>

      {/* Our Goals Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-6">
            <div className="bg-[#8C1515] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl">
              ♻️
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#8C1515] mb-4">Our Goals</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To connect the BU community with surplus food from campus events, reducing waste 
                and promoting sustainability through technology and community engagement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-[#8C1515] text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform">
            <div className="bg-yellow-400 text-[#8C1515] w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              🔍
            </div>
            <h3 className="text-2xl font-bold text-[#8C1515] mb-4">Find Events</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse upcoming events with available surplus food on campus using our search platform.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform">
            <div className="bg-yellow-400 text-[#8C1515] w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              📦
            </div>
            <h3 className="text-2xl font-bold text-[#8C1515] mb-4">Pick Up Food</h3>
            <p className="text-gray-600 leading-relaxed">
              Claim available food items and pick them up at the specified event location and time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform">
            <div className="bg-yellow-400 text-[#8C1515] w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              🌱
            </div>
            <h3 className="text-2xl font-bold text-[#8C1515] mb-4">Reduce Waste</h3>
            <p className="text-gray-600 leading-relaxed">
              Enjoy delicious food while helping BU reduce its environmental footprint and food waste.
            </p>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-[#8C1515] text-center mb-12">Meet the Team</h2>
        <div className="flex justify-center flex-wrap gap-8">
          {/* Richard */}
          <a
            href="https://www.linkedin.com/in/richardpilleul"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-lg p-6 text-center w-64 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all cursor-pointer block relative"
          >
            <div className="absolute top-4 right-4">
              <LinkedInIcon />
            </div>
            <Image
              src="/images/team/Richard.png"
              alt="Richard"
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4 object-cover"
              unoptimized
            />
            <h3 className="text-xl font-bold text-[#8C1515] mb-2">Richard</h3>
            <p className="text-gray-600">Developer</p>
          </a>

          {/* Shuwan */}
          <a
            href="https://www.linkedin.com/in/shuwan-zhao-9b6302293/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-lg p-6 text-center w-64 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all cursor-pointer block relative"
          >
            <div className="absolute top-4 right-4">
              <LinkedInIcon />
            </div>
            <Image
              src="/images/team/Shuwan.png"
              alt="Shuwan"
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4 object-cover"
              unoptimized
            />
            <h3 className="text-xl font-bold text-[#8C1515] mb-2">Shuwan</h3>
            <p className="text-gray-600">Developer</p>
          </a>

          {/* Suhruth */}
          <a
            href="https://www.linkedin.com/in/suhruthvuppala"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-lg p-6 text-center w-64 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all cursor-pointer block relative"
          >
            <div className="absolute top-4 right-4">
              <LinkedInIcon />
            </div>
            <Image
              src="/images/team/Suhruth.png"
              alt="Suhruth"
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4 object-cover"
              unoptimized
            />
            <h3 className="text-xl font-bold text-[#8C1515] mb-2">Suhruth</h3>
            <p className="text-gray-600">Developer</p>
          </a>

          {/* Thomas */}
          <a
            href="https://www.linkedin.com/in/thomas-idrobo"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-lg p-6 text-center w-64 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all cursor-pointer block relative"
          >
            <div className="absolute top-4 right-4">
              <LinkedInIcon />
            </div>
            <Image
              src="/images/team/Thomas.png"
              alt="Thomas"
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4 object-cover"
              unoptimized
            />
            <h3 className="text-xl font-bold text-[#8C1515] mb-2">Thomas</h3>
            <p className="text-gray-600">Developer</p>
          </a>

          {/* Yandu */}
          <a
            href="http://www.linkedin.com/in/yanduge"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-lg p-6 text-center w-64 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all cursor-pointer block relative"
          >
            <div className="absolute top-4 right-4">
              <LinkedInIcon />
            </div>
            <Image
              src="/images/team/Yandu.png"
              alt="Yandu"
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4 object-cover"
              unoptimized
            />
            <h3 className="text-xl font-bold text-[#8C1515] mb-2">Yandu</h3>
            <p className="text-gray-600">Developer</p>
          </a>
        </div>
      </div>
    </div>
  );
}
import { getCookies } from '@/utils/helper';
import Image from 'next/image';
import teamImg from '@/assets/images/team-img.webp';

export default function Home() {
  return (
    <div className="bg-pg min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 py-12">
            <h1 className="text-4xl font-bold mb-4">
              Advanced Flood Modeling for a Safer Tomorrow
            </h1>
            <p className="mb-6">
              CLISA leverages cutting-edge technology to provide precise flood
              modeling solutions, helping communities and organizations better
              prepare for and respond to flooding events.
            </p>
            <button className="bg-primary text-white px-8 py-4 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform active:scale-95 transition-transform duration-150">
              Discover Our Solutions
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-2">
                  Hydrological Modeling
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-2">
                  Flood Risk Assessment
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-2">
                  Real-Time Monitoring
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  Impact Analysis
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold">200+</p>
                  <p>Projects worldwide ensuring flood safety</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">
            Trusted by Industry Leaders in Environmental Safety
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Image src={s1} alt="Chanel" width={100} height={50} />
            <Image src={s2} alt="Nike" width={100} height={50} />
            <Image src={s3} alt="Gucci" width={100} height={50} />
          </div>
        </div>
      </section> */}

      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <Image
              src={teamImg}
              alt="Team Meeting"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="lg:w-1/2 lg:pl-12">
            <h2 className="text-2xl font-bold  mb-4">Why Choose CLISA?</h2>
            <p className="mb-6">
              At CLISA, our mission is to provide state-of-the-art flood
              modeling tools that empower communities to mitigate risks and
              protect lives. Our innovative solutions are backed by years of
              research and real-world application.
            </p>
            <button className="bg-primary text-white px-8 py-2 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform active:scale-95 transition-transform duration-150">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Our Core Services
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-150">
            <p className="text-center font-bold">Flood Simulation</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-150">
            <p className="text-center font-bold">Risk Management</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-150">
            <p className="text-center font-bold">Early Warning Systems</p>
          </div>
        </div>
      </section>

      {/* <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="text-center transform hover:scale-105 transition-transform duration-150">
            <Image
              src="/taylor.jpg"
              alt="Taylor Bale"
              width={150}
              height={150}
              className="rounded-full"
            />
            <p className="font-bold mt-2">Taylor Bale</p>
            <p>Lead Hydrologist</p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-150">
            <Image
              src="/christian.jpg"
              alt="Christian Naz"
              width={150}
              height={150}
              className="rounded-full"
            />
            <p className="font-bold mt-2">Christian Naz</p>
            <p>Project Manager</p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-150">
            <Image
              src="/eyzen.jpg"
              alt="Eyzen Nile"
              width={150}
              height={150}
              className="rounded-full"
            />
            <p className="font-bold mt-2">Eyzen Nile</p>
            <p>Data Scientist</p>
          </div>
        </div>
      </section> */}

      <section className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-full lg:w-1/3 bg-pg p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-150">
            <h3 className="font-bold mb-2">What is CLISA?</h3>
            <p>
              CLISA is an advanced flood modeling platform designed to help
              communities and organizations predict, assess, and mitigate flood
              risks through sophisticated simulations and data-driven insights.
            </p>
          </div>
          <div className="w-full lg:w-1/3 bg-pg p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-150">
            <h3 className="font-bold mb-2">
              What services does CLISA provide?
            </h3>
            <p>
              We offer a comprehensive range of services including hydrological
              modeling, flood risk assessments, and the development of early
              warning systems to enhance flood preparedness.
            </p>
          </div>
          <div className="w-full lg:w-1/3 bg-pg p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-150">
            <h3 className="font-bold mb-2">How can I partner with CLISA?</h3>
            <p>
              We work closely with governments, NGOs, and private organizations
              to provide tailored flood modeling solutions. Contact us to
              discuss collaboration opportunities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
// export default function Home() {
//   return (
//     <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
//       <video
//         src="/videos/home-bg-vid.mp4"
//         autoPlay
//         loop
//         muted
//         className="absolute inset-0 w-full h-full object-cover"
//       />
//       <div className="absolute inset-0 bg-black opacity-30" />
//       {/* <div className="relative z-10 px-4 py-8 bg-black bg-opacity-40 rounded-lg shadow-lg text-center text-white">
//         <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
//           CLISA
//         </h1>
//       </div> */}
//     </main>
//   );
// }

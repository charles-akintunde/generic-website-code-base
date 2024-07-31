export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <video
        src="/videos/home-bg-vid.mp4"
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-30" />
      {/* <div className="relative z-10 px-4 py-8 bg-black bg-opacity-40 rounded-lg shadow-lg text-center text-white">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
          CLISA
        </h1>
      </div> */}
    </main>
  );
}

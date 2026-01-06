import Image from "next/image";

const Loading = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50">
    <div className="relative flex h-24 w-24 items-center justify-center">
      {/* Spinner Ring */}
      <div className="absolute h-full w-full animate-spin rounded-full border-8 border-teal-500 border-t-transparent"></div>
      {/* Flowcast Icon */}
      <Image
        src="/favicon-96x96.png" // Pastikan path ke logo Anda benar
        alt="Flowcast Logo"
        width={40}
        height={40}
        className="animate-pulse"
        priority
      />
    </div>
    <p className="mt-6 text-2xl text-gray-700">Memuat Halaman...</p>
  </div>
);

export default Loading;
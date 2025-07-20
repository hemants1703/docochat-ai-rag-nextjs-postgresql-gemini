import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Upload } from "lucide-react";
import { Red_Rose } from "next/font/google";

const redRose = Red_Rose({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Home() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 ${redRose.className}`}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 px-4 text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 animate-fade-in">
        {/* Animated Blobs */}
        <svg
          className="absolute left-[-10%] top-[-10%] w-[400px] h-[400px] opacity-30 blur-2xl animate-blob-slow pointer-events-none select-none"
          viewBox="0 0 400 400"
          fill="none"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#a5b4fc" />
        </svg>
        <svg
          className="absolute right-[-10%] bottom-[-10%] w-[300px] h-[300px] opacity-20 blur-2xl animate-blob-fast pointer-events-none select-none"
          viewBox="0 0 400 400"
          fill="none"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#f472b6" />
        </svg>
        <Image
          src="/3d-doc.png"
          alt="Docochat AI"
          width={120}
          height={120}
          className="mx-auto mb-6 drop-shadow-xl animate-fade-in"
        />
        <div className="max-w-5xl mx-auto">
          <h1 className="text-8xl font-extrabold mb-6 text-gray-900 dark:text-gray-100 tracking-tight relative z-10 animate-glow">
            Docochat AI
          </h1>
          <p className="text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in delay-100">
            Engage with your documents like never before. Upload, train, and
            converse with your files effortlessly.
          </p>
          <Button
            asChild
            size="lg"
            className="group bg-gray-900 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-pink-500 text-white dark:bg-gray-100 dark:hover:bg-gradient-to-r dark:hover:from-indigo-300 dark:hover:to-pink-200 dark:text-gray-900 font-medium shadow-lg transition-all duration-300 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-pink-200"
          >
            <Link href="/train" prefetch={true} className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Get Started
            </Link>
          </Button>
        </div>
        {/* Scroll Down Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center z-10">
          <span className="block w-1.5 h-8 bg-gradient-to-b from-indigo-400 to-pink-400 rounded-full animate-bounce mb-2 opacity-80" />
          <span className="text-xs text-gray-500 dark:text-gray-400 tracking-wide">
            Scroll
          </span>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white dark:bg-gray-900 animate-fade-in delay-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold mb-16 text-center text-gray-900 dark:text-gray-100 tracking-tight animate-fade-in delay-300">
            Why Choose Docochat AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 animate-fade-in delay-400">
              <FileText className="h-12 w-12 mx-auto mb-4 text-indigo-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Supported Formats
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                PDF, DOCX, TXT, MD, CSV, RTF
              </p>
            </div>
            <div className="group text-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 animate-fade-in delay-500">
              <Upload className="h-12 w-12 mx-auto mb-4 text-indigo-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Seamless Upload & Train
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Integrate and train your documents with advanced AI seamlessly.
              </p>
            </div>
            <div className="group text-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 animate-fade-in delay-600">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-indigo-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Intelligent Conversations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Extract insights and answers from your documents instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 animate-fade-in delay-700">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6 text-gray-900 dark:text-gray-100 tracking-tight animate-fade-in delay-800">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-2xl mb-10 text-gray-600 dark:text-gray-300 animate-fade-in delay-900">
            Unlock 100 free credits and start your intelligent document journey
            today.
          </p>
          <Button
            asChild
            size="lg"
            className="group bg-gray-900 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-pink-500 text-white dark:bg-gray-100 dark:hover:bg-gradient-to-r dark:hover:from-indigo-300 dark:hover:to-pink-200 dark:text-gray-900 font-medium shadow-lg transition-all duration-300 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-pink-200"
          >
            <Link href="/train" prefetch={true} className="flex items-center">
              Start Chatting Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-fade-in delay-1000">
        <p>
          &copy; {new Date().getFullYear()} Docochat AI. All rights reserved.
        </p>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(.4,0,.2,1) both;
        }
        .delay-100 { animation-delay: .1s; }
        .delay-200 { animation-delay: .2s; }
        .delay-300 { animation-delay: .3s; }
        .delay-400 { animation-delay: .4s; }
        .delay-500 { animation-delay: .5s; }
        .delay-600 { animation-delay: .6s; }
        .delay-700 { animation-delay: .7s; }
        .delay-800 { animation-delay: .8s; }
        .delay-900 { animation-delay: .9s; }
        .delay-1000 { animation-delay: 1s; }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 32px #a5b4fc, 0 0 8px #f472b6; }
          50% { text-shadow: 0 0 48px #f472b6, 0 0 16px #a5b4fc; }
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite alternate;
        }
        @keyframes blob-slow {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.1) translateY(20px); }
        }
        .animate-blob-slow {
          animation: blob-slow 12s ease-in-out infinite;
        }
        @keyframes blob-fast {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.15) translateY(-16px); }
        }
        .animate-blob-fast {
          animation: blob-fast 8s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite;
        }
      `}</style>
    </div>
  );
}

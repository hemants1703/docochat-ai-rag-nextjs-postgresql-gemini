import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
            Docochat AI
          </h1>
          <p className="text-2xl mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Engage with your documents like never before. Upload, train, and
            converse with your files effortlessly.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 font-medium"
          >
            <Link href="/train" prefetch={true}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Get Started
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold mb-16 text-center text-gray-900 dark:text-gray-100 tracking-tight">
            Why Choose Docochat AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-900 dark:text-gray-100" />
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                Supported Formats
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                PDF, DOCX, TXT, MD, CSV, RTF
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-900 dark:text-gray-100" />
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                Seamless Upload & Train
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Integrate and train your documents with advanced AI seamlessly.
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-900 dark:text-gray-100" />
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
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
      <section className="py-24 px-4 text-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-2xl mb-10 text-gray-600 dark:text-gray-300">
            Unlock 100 free credits and start your intelligent document journey
            today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 font-medium"
          >
            <Link href="/train" prefetch={true}>
              Start Chatting Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <p>
          &copy; {new Date().getFullYear()} Docochat AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

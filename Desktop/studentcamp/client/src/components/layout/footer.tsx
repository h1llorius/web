import { Link } from "wouter";
import { Wrench, Twitter, Github, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Wrench className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold">EasyToolbox</h3>
                <p className="text-slate-400 text-sm">Digital Toolkit</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              Simplifying digital tasks with powerful, easy-to-use tools. Convert, create, and enhance your content with professional-grade quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Github size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link href="/youtube-converter" className="hover:text-white transition-colors duration-200">YouTube Converter</Link></li>
              <li><Link href="/bg-remover" className="hover:text-white transition-colors duration-200">Background Remover</Link></li>
  
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/credits" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 EasyToolbox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Mail, Phone, Globe, Share2, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#FFE600] pt-24 md:pt-32 font-sans relative">
      {/* Curved Container to match premium section transitions */}
      <div className="bg-[#1A1A1A] rounded-t-[40px] px-8 md:px-16 py-16 md:py-24 text-white flex flex-col justify-between h-full">
        <div className="flex flex-col xl:flex-row justify-between gap-16">
          
          {/* Brand Info */}
          <div className="max-w-md">
            <h2 className="text-4xl md:text-6xl font-black text-[#FFE600] tracking-tighter uppercase mb-6 leading-none">Saffron<br />& Silk</h2>
            <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed">
              Bringing the royal heritage of Indian culinary arts to your table. A symphony of spices, silk, and saffron.
            </p>
          </div>

          <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-24">
              <div className="space-y-4">
                <h4 className="text-[#FFE600] text-[10px] font-black uppercase tracking-[0.2em]">Contact Us</h4>
                <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed">
                  102 Royal Palace Road<br />New Delhi, India
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    <Mail size={14} className="text-[#FFE600]" />
                    <span>royal@saffron-silk.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    <Phone size={14} className="text-[#FFE600]" />
                    <span>+91 11 2345 6789</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[#FFE600] text-[10px] font-black uppercase tracking-[0.2em]">Opening Hours</h4>
                <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed">
                  Mon - Thu: 11:00 - 23:00<br />
                  Fri - Sun: 11:00 - 00:00
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[#FFE600] text-[10px] font-black uppercase tracking-[0.2em]">Quick Links</h4>
                <div className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest">
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Philosophy</a>
                  <a href="#menu" className="text-white/60 hover:text-white transition-colors">Royal Menu</a>
                  <a href="#events" className="text-white/60 hover:text-white transition-colors">Festivals</a>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Reservations</a>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="max-w-md w-full pt-8">
              <h4 className="text-[#FFE600] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Join the Royal Circle</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="YOUR@EMAIL.COM" 
                  className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-[#FFE600] transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-[#FFE600] text-black px-4 rounded-full hover:bg-white transition-all">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-24 md:mt-32 pt-12 border-t border-white/5 gap-8">
          <div className="flex gap-6">
            <a href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <Globe size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <Share2 size={18} />
            </a>
          </div>
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
            © 2026 Saffron & Silk. All Rights Reserved. Designed for Royalty.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

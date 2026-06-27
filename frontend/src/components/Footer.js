"use client";

import Link from "next/link";
import { Globe, MessageCircle, Share2, Play, Mail, Phone, MapPin, CreditCard, Shield, Truck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-white mt-auto">
      {/* Trust bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 text-gray-300">
              <div className="bg-blue-600/20 p-2 rounded-full">
                <Truck size={20} className="text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">{t('freeDelivery')}</p>
                <p className="text-xs text-gray-500">{t('freeDeliverySub')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-300">
              <div className="bg-green-600/20 p-2 rounded-full">
                <Shield size={20} className="text-green-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">{t('securePayments')}</p>
                <p className="text-xs text-gray-500">{t('securePaymentsSub')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-300">
              <div className="bg-purple-600/20 p-2 rounded-full">
                <CreditCard size={20} className="text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">{t('optimusTransfer')}</p>
                <p className="text-xs text-gray-500">{t('optimusTransferSub')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center group mb-5">
              <img
                src="/orca_logo.png"
                alt="ORCA Logo"
                className="h-10 w-auto object-contain mr-3 brightness-0 invert group-hover:brightness-75 transition-all"
              />
              <span className="font-black text-2xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                ORCA
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('brandDescription')}
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Globe, href: "#", label: "Website" },
                { Icon: MessageCircle, href: "#", label: "Chat" },
                { Icon: Share2, href: "#", label: "Share" },
                { Icon: Play, href: "#", label: "Videos" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="bg-gray-800 hover:bg-blue-600 p-2.5 rounded-xl transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base text-white mb-5 tracking-wide uppercase text-xs text-gray-400">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: t('allProducts'), href: "/shop" },
                { label: t('livingRoom'), href: "/shop?category=Living Room" },
                { label: t('kitchen'), href: "/shop?category=Kitchen" },
                { label: t('bedroom'), href: "/shop?category=Bedroom" },
                { label: t('office'), href: "/shop?category=Office" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors hover:pl-1 duration-200 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-base text-white mb-5 uppercase text-xs text-gray-400 tracking-wide">
              {t('support')}
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: t('myAccount'), href: "/dashboard" },
                { label: t('trackOrder'), href: "/dashboard" },
                { label: t('returnsExchanges'), href: "#" },
                { label: t('shippingInfo'), href: "#" },
                { label: t('contactUs'), href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors hover:pl-1 duration-200 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-bold text-base text-white mb-5 uppercase text-xs text-gray-400 tracking-wide">
              {t('stayConnected')}
            </h4>
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400 flex-shrink-0" />
                <span>support@orca.store</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-400 flex-shrink-0" />
                <span>+234 800 000 0000</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>

            <p className="text-gray-400 text-xs mb-3">{t('subscribeDeals')}</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 border-r-0"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-r-xl transition-colors"
              >
                {t('go')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ORCA Store. {t('copyright')}</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t('termsOfService')}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t('cookiePolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

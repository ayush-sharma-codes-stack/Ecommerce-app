import { Link } from 'react-router-dom'
import { GitFork, Mail, Heart, Globe, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-500 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl gradient-text">ShopElite</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Premium e-commerce platform delivering extraordinary products with an exceptional shopping experience.
            </p>
            <div className="flex gap-3 mt-4">
              {[GitFork, Globe, Send, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-dark-500 hover:bg-primary-600/30 hover:border-primary-500 border border-dark-400 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-400 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              {['All Products', 'Electronics', 'Clothing', 'Books', 'Sports'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-slate-400 hover:text-primary-400 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              {[['Profile', '/profile'], ['My Orders', '/orders'], ['Cart', '/cart'], ['Login', '/login']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-primary-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-dark-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-sm">© 2024 ShopElite. All rights reserved.</p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Built with <Heart size={14} className="text-rose-500 fill-rose-500" /> using React & Node.js
          </p>
        </div>
      </div>
    </footer>
  )
}

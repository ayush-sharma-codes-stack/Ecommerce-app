import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-[10rem] font-display font-bold leading-none gradient-text opacity-30 select-none">404</div>
        <h1 className="text-4xl font-display font-bold text-white -mt-8 mb-4">Page Not Found</h1>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">Oops! The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary"><Home size={18} /> Go Home</Link>
          <button onClick={() => history.back()} className="btn-secondary"><ArrowLeft size={18} /> Go Back</button>
        </div>
      </motion.div>
    </div>
  )
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  // Define icons at the top of the component
  const AlertCircleIcon = getIcon('AlertCircle');
  const HomeIcon = getIcon('Home');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto p-6"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 dark:text-red-400">
            <AlertCircleIcon size={48} />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center px-5 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
        >
          <HomeIcon size={18} className="mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;
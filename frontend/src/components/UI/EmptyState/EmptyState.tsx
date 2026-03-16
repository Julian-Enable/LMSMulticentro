import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center py-16 px-8 ${className}`}
    >
      <div className="w-24 h-24 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center shadow-lg">
        <Icon className="w-12 h-12 text-gray-400 dark:text-slate-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}

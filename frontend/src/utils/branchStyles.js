import { CodeBracketIcon, SparklesIcon, CogIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';

/**
 * Styles centralisés pour les branches
 */
export const BRANCH_STYLES = {
  web: {
    icon: <CodeBracketIcon className="h-12 w-12" />,
    bgClasses: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800',
    borderClasses: 'border-blue-200 dark:border-blue-700',
    iconBgClasses: 'bg-blue-200 dark:bg-blue-700',
    buttonClasses: 'from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-400 dark:hover:to-blue-500',
    overlayClasses: 'from-blue-600/80',
    textClasses: 'text-blue-600 dark:text-blue-400',
  },
  ia: {
    icon: <SparklesIcon className="h-12 w-12" />,
    bgClasses: 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800',
    borderClasses: 'border-purple-200 dark:border-purple-700',
    iconBgClasses: 'bg-purple-200 dark:bg-purple-700',
    buttonClasses: 'from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-400 dark:hover:to-purple-500',
    overlayClasses: 'from-purple-600/80',
    textClasses: 'text-purple-600 dark:text-purple-400',
  },
  devops: {
    icon: <CogIcon className="h-12 w-12" />,
    bgClasses: 'from-green-50 to-green-100 dark:from-green-900 dark:to-green-800',
    borderClasses: 'border-green-200 dark:border-green-700',
    iconBgClasses: 'bg-green-200 dark:bg-green-700',
    buttonClasses: 'from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-green-800 dark:hover:from-green-400 dark:hover:to-green-500',
    overlayClasses: 'from-green-600/80',
    textClasses: 'text-green-600 dark:text-green-400',
  },
  cybersecurity: {
    icon: <ShieldCheckIcon className="h-12 w-12" />,
    bgClasses: 'from-red-50 to-red-100 dark:from-red-900 dark:to-red-800',
    borderClasses: 'border-red-200 dark:border-red-700',
    iconBgClasses: 'bg-red-200 dark:bg-red-700',
    buttonClasses: 'from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 hover:from-red-700 hover:to-red-800 dark:hover:from-red-400 dark:hover:to-red-500',
    overlayClasses: 'from-red-600/80',
    textClasses: 'text-red-600 dark:text-red-400',
  },
  'data science': {
    icon: <ChartBarIcon className="h-12 w-12" />,
    bgClasses: 'from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800',
    borderClasses: 'border-indigo-200 dark:border-indigo-700',
    iconBgClasses: 'bg-indigo-200 dark:bg-indigo-700',
    buttonClasses: 'from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-400 dark:hover:to-indigo-500',
    overlayClasses: 'from-indigo-600/80',
    textClasses: 'text-indigo-600 dark:text-indigo-400',
  },
  default: {
    icon: <CodeBracketIcon className="h-12 w-12" />,
    bgClasses: 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
    borderClasses: 'border-gray-200 dark:border-gray-700',
    iconBgClasses: 'bg-gray-200 dark:bg-gray-700',
    buttonClasses: 'from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-400 dark:hover:to-gray-500',
    overlayClasses: 'from-gray-600/80',
    textClasses: 'text-gray-600 dark:text-gray-400',
  },
};

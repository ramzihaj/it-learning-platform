import { useEffect } from 'react';
import CourseList from '@/components/CourseList';

/**
 * Page des cours
 */
export default function CoursesPage() {
  useEffect(() => {
    document.title = 'Cours - IT Learning Platform';
  }, []);

  return <CourseList />;
}

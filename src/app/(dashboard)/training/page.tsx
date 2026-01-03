import React from 'react';
import { getTrainingCourses } from '@/lib/actions/training-actions';
import TrainingClientWrapper from '@/components/training/TrainingClientWrapper';

export default async function TrainingPage() {
    const courses = await getTrainingCourses();

    const mockCourses = [
        { id: 'c1', title: 'Cybersecurity Awareness 2025', description: 'Essential security practices for all employees.', progress: 0, duration: '1h 30m', category: 'Compliance', image: '/images/training/security.jpg' },
        { id: 'c2', title: 'Advanced Project Management', description: 'Mastering agile methodologies and risk management.', progress: 45, duration: '4h 15m', category: 'Professional', image: '/images/training/pm.jpg' },
        { id: 'c3', title: 'Workplace Safety Standards', description: 'Occupational health and safety guidelines.', progress: 100, status: 'COMPLETED', duration: '2h 00m', category: 'Safety', image: '/images/training/safety.jpg' },
        { id: 'c4', title: 'Leadership 101: Effective Communication', description: 'Building better teams through clear communication.', progress: 10, duration: '3h 45m', category: 'Leadership', image: '/images/training/leadership.jpg' },
    ];
    const finalCourses = courses.length > 0 ? courses : mockCourses;

    return <TrainingClientWrapper courses={finalCourses} />;
}

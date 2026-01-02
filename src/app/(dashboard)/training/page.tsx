import React from 'react';
import { getTrainingCourses } from '@/lib/actions/training-actions';
import TrainingClientWrapper from '@/components/training/TrainingClientWrapper';

export default async function TrainingPage() {
    const courses = await getTrainingCourses();

    return <TrainingClientWrapper courses={courses} />;
}

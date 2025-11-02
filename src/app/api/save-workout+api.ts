import { adminClient } from '@/lib/sanity/client';

export interface WorkoutData {
    _type: string;
    userId: string;
    date: string;
    duration: number;
    exercises: WorkoutDataExercise[];
}

export interface WorkoutDataExercise {
    _type: string;
    _key: string;
    exercise: {
        _type: string;
        _ref: string;
    };
    sets: WorkoutDataExerciseSet[];
}

export interface WorkoutDataExerciseSet {
    _type: string;
    _key: string;
    reps: number;
    weight: number;
    weightUnit: 'kg' | 'lbs';
}

export async function POST(request: Request) {
    const { workoutData }: { workoutData: WorkoutData } = await request.json();

    try {
        const result = await adminClient.create(workoutData);

        return Response.json({
            success: true,
            workoutId: result._id,
            message: 'Workout saved successfully.',
        })
    } catch (error) {
        return new Response('Failed to save workout', { status: 500 });
    }
}

import { adminClient } from '@/lib/sanity/client';

export async function POST(request: Request) {
    const { workoutId }: { workoutId: string } = await request.json();

    try {
        await adminClient.delete(workoutId);
        
        return Response.json({
            success: true,
            message: 'Workout deleted successfully',
        })
    } catch (error) {
        console.error('Error saving workout:', error);
        return Response.json({ error: 'Failed to delete workout' }, { status: 500 });
    }
}

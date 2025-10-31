import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface WorkoutSet {
    id: string;
    reps: string;
    weight: string;
    weightUnit: 'kg' | 'lbs';
    isCompleted: boolean;
}

export interface WorkoutExercise {
    id: string;
    sanityId: string;
    name: string;
    sets: WorkoutSet[];
}

export interface AddExerciseToWorkoutPayload {
    name: string;
    sanityId: string;
}

export interface WorkoutStore {
    // State
    workoutExercises: WorkoutExercise[];
    weightUnit: 'kg' | 'lbs';
    workoutStartTime: number;
    // Actions
    addExerciseToWorkout: (exercise: AddExerciseToWorkoutPayload) => void;
    setWorkoutExercises: (
        exercises:
            | WorkoutExercise[]
            | ((prev: WorkoutExercise[]) => WorkoutExercise[])
    ) => void;
    setWeightUnit: (unit: 'kg' | 'lbs') => void;
    resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
    persist(
        (set) => {
            return {
                // State
                workoutExercises: [],
                weightUnit: 'kg',
                workoutStartTime: 0,
                // Actions
                addExerciseToWorkout: (exercise) => {
                    set((state) => {
                        const newExercise: WorkoutExercise = {
                            id: Math.random().toString(),
                            sanityId: exercise.sanityId,
                            name: exercise.name,
                            sets: [],
                        };
                        return {
                            workoutExercises: [...state.workoutExercises, newExercise],
                        };
                    });
                },
                setWorkoutExercises: (exercises) => {
                    set((state) => {
                        return {
                            workoutExercises:
                                typeof exercises === 'function'
                                    ? exercises(state.workoutExercises)
                                    : exercises,
                        }
                    });
                },
                setWeightUnit: (unit) => {
                    set((state) => {
                        return {
                            weightUnit: unit,
                        }
                    })
                },
                resetWorkout: () => {
                    set(() => {
                        return {
                            workoutExercises: [],
                        }
                    })
                }
            };
        },
        {
            name: 'workout-store',
            storage: createJSONStorage(() => AsyncStorage),
            // Select the parts of the state to persist
            partialize: (state) => {
                return {
                    weightUnit: state.weightUnit,
                };
            }
        }
    )
);

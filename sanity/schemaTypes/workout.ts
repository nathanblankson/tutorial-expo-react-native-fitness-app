import { defineArrayMember, defineField, defineType } from 'sanity'

export const workout = defineType({
    name: 'workout',
    title: 'Workout',
    type: 'document',
    icon: () => '💪',
    fields: [
        defineField({
            name: 'userId',
            title: 'User ID',
            type: 'string',
            description: 'The Clerk user ID of the person who performed this workout',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Workout Date',
            type: 'datetime',
            description: 'The date when this workout was performed',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'duration',
            title: 'Duration (seconds)',
            type: 'number',
            description: 'The total duration of the workout in seconds',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'exercises',
            title: 'Workout Exercises',
            type: 'array',
            description: 'The exercises performed in this workout with sets, reps and weights',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'workoutExercise',
                    title: 'Workout Exercise',
                    fields: [
                        defineField({
                            name: 'exercise',
                            title: 'Exercise',
                            type: 'reference',
                            description: 'The exercise that was performed',
                            to: [{ type: 'exercise' }],
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'sets',
                            title: 'Sets',
                            type: 'array',
                            description: 'The sets performed for this exercise with reps and weight details',
                            of: [
                                defineArrayMember({
                                    type: 'object',
                                    name: 'set',
                                    title: 'Set',
                                    fields: [
                                        defineField({
                                            name: 'reps',
                                            title: 'Repetitions',
                                            type: 'number',
                                            description: 'The number of repetitions performed for this set',
                                            validation: (Rule) => Rule.required().min(0),
                                        }),
                                        defineField({
                                            name: 'weight',
                                            title: 'Weight',
                                            type: 'number',
                                            description: 'The weight used for this set (if applicable)',
                                            validation: (Rule) => Rule.min(0),
                                        }),
                                        defineField({
                                            name: 'weightUnit',
                                            title: 'Weight Unit',
                                            type: 'string',
                                            description: 'The unit of weight used (lbs or kg)',
                                            options: {
                                                list: [
                                                    { title: 'Pounds (lbs)', value: 'lbs' },
                                                    { title: 'Kilograms (kg)', value: 'kg' },
                                                ],
                                                layout: 'radio',
                                            },
                                            initialValue: 'kg',
                                            validation: (Rule) => Rule.required(),
                                        }),
                                    ],
                                    preview: {
                                        select: {
                                            reps: 'reps',
                                            weight: 'weight',
                                            weightUnit: 'weightUnit',
                                        },
                                        prepare({ reps, weight, weightUnit }) {
                                            return {
                                                title: `Set: ${reps} reps`,
                                                subtitle: weight ? `${weight} ${weightUnit}` : 'Bodyweight',
                                            }
                                        }
                                    }
                                }),
                            ],
                            validation: (Rule) => Rule.required().min(1),
                        })
                    ],
                    preview: {
                        select: {
                            title: 'exercise.name',
                            sets: 'sets',
                        },
                        prepare({ title, sets }) {
                            const setCount = sets ? sets.length : 0;
                            return {
                                title: title || 'Exercise',
                                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`,
                            }
                        }
                    }
                })
            ],
        }),
    ],
    preview: {
        select: {
            date: 'date',
            duration: 'duration',
            exercises: 'exercises',
        },
        prepare({ date, duration, exercises }) {
            const workoutDate = date ? new Date(date).toLocaleDateString() : 'No date';
            const durationMinutes = duration ? Math.round(duration / 60) : 0;
            const exerciseCount = exercises ? exercises.length : 0;

            return {
                title: `Workout - ${workoutDate}`,
                subtitle: `${durationMinutes} min | ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`,
            }
        }
    }
});

import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    const { exerciseName } = await request.json();

    if (!exerciseName) {
        return Response.json({ error: 'Exercise name is required' }, { status: 400 });
    }

    const prompt = `
You are a fitness coach.
You are given an exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required.
Explain the exercise in detail for a beginner.

The exercise name is "${exerciseName}".

Keep it short and concise. Use markdown formatting.

Use the following format:

## Equipment Required

## Instructions

### Tips

### Variations

### Safety

keep spacing between the headings and the content.

Always use headings and subheading.
`;

    try {
        // ✅ Early return for testing purposes (no OpenAI API call)
        const aiResponse = `
## Equipment Required

- Barbell
- Flat bench
- Weight plates (optional, based on your fitness level)
- Spotter (recommended for safety)

## Instructions

1. **Setup**
   Lie down on a flat bench with your back flat and feet planted firmly on the ground. Ensure your head, shoulders, and buttocks are in contact with the bench.

2. **Grip the Barbell**
   Grasp the barbell with both hands slightly wider than shoulder-width apart. Your palms should be facing forward.

3. **Position the Barbell**
   Lift the barbell off the rack and position it directly above your chest with your arms fully extended. This is your starting position.

4. **Lower the Barbell**
   Slowly lower the barbell toward your chest while keeping your elbows at about a 45-degree angle from your body. Inhale as you lower the bar.

5. **Press the Barbell**
   Press the barbell back up to the starting position, exhaling as you do so. Ensure your movements are controlled.

6. **Repeat**
   Perform the desired number of repetitions, usually 8–12 for beginners.

## Tips

- Start with a lighter weight to focus on form before adding heavier weights.
- Keep your core engaged to stabilize your body throughout the movement.
- Keep your wrists straight and avoid excessive arching of your back.

## Variations

- **Dumbbell Bench Press**: Use dumbbells instead of a barbell for greater range of motion.
- **Incline Bench Press**: Adjust the bench to a 30–45° angle to target the upper chest.

## Safety

- Always use a spotter if lifting heavy weights.
- Keep your feet flat on the ground at all times.
- Do not lower the barbell too quickly — maintain control throughout the movement.
`;

        return Response.json({ message: aiResponse });

        // 🚀 Uncomment below when ready to call OpenAI API
        /*
         const response = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [{ role: 'user', content: prompt }],
         });

         const aiMessage = response.choices[0].message.content;
         console.log('OpenAI response:', aiMessage);

         return Response.json({ message: aiMessage });
         */
    } catch (error) {
        console.error('Error fetching AI guidance:', error);
        return Response.json({ error: 'Error fetching AI guidance' }, { status: 500 });
    }
}

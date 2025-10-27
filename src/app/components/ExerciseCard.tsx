import { Text, View } from 'react-native'

export interface ExerciseCardProps {
    item: any;
    onPress: () => void;
}

export default function ExerciseCard(
    { item, onPress }: ExerciseCardProps
) {
    return (
        <View>
            <Text>ExerciseCard</Text>
        </View>
    )
}

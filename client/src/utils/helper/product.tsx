
import Icon from 'react-native-vector-icons/MaterialIcons';
export const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Icon
                key={index}
                name="star"
                size={16}
                color={index < rating ? "#FFD700" : "#E0E0E0"}
            />
        ));
    };
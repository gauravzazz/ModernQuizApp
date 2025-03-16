import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Configure UUID to use React Native crypto implementation
const UUID = {
  v4: () => uuidv4({ random: crypto.getRandomValues(new Uint8Array(16)) })
};

export default UUID;
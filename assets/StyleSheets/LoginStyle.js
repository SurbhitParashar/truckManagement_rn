import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F6FA',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      width: CARD_WIDTH,
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      // iOS shadow
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      // Android shadow
      elevation: 4,
    },
    iconWrapper: {
      backgroundColor: '#3366FF',
      width: 64,
      height: 64,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 4,
      color: '#1E2732',
    },
    subtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 24,
    },
    inputGroup: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    inputIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: '#374151',
    },
    button: {
      width: '100%',
      height: 48,
      backgroundColor: '#3366FF',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '500',
    },
  });

export default styles
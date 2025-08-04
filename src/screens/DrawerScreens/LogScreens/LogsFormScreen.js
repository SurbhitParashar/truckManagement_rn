// LogsList.js
import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const logs = [
  { date: 'Sun, Apr 20', time: '00:00:00m', status: 'Form' },
  { date: 'Sat, Apr 19', time: '00:00:00m', status: 'Form' },
  { date: 'Fri, Apr 18', time: '00:00:00m', status: 'Form' },
  { date: 'Thu, Apr 17', time: '00:00:00m', status: 'Form' },
  { date: 'Wed, Apr 16', time: '00:00:00m', status: 'Form' },
]

export default function LogsList() {
  const navigation = useNavigation()

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('LogsDetail', {
          date: item.date,
          time: item.time,
          status: item.status,
        })
      }
    >
      <View style={styles.left}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.status}>{item.status}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.date}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '600',
    padding: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  date: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
  },
})

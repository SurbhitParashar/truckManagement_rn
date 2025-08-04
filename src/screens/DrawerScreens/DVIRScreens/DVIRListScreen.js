// screens/DrawerScreens/DVIRScreens/DVIRListScreen.js
import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sampleDVIRs = [
  { id:'1', time:'11 Apr 25 8:26 pm', vehicle:'Vehicle 23', tDefect:'No Defects' },
  { id:'2', time:'12 Apr 25 9:26 pm', vehicle:'Vehicle 24', tDefect:'No Defects' },
  // … more sample items …
];

export default function DVIRListScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="#007AFF" onPress={() => navigation.openDrawer()} />
        <Text style={styles.title}>DVIRs</Text>
        <Ionicons name="add-circle-outline" size={28} color="#007AFF" onPress={() => navigation.navigate('InsertDVIR')} />
      </View>
      <FlatList
        data={sampleDVIRs}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DVIRDetail', { dvir: item })}
          >
            <View>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.subText}>{item.vehicle}</Text>
              <Text style={styles.subText}>{item.tDefect}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  header: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    padding:16, borderBottomWidth:1, borderColor:'#eee'
  },
  title: { fontSize:20, fontWeight:'600', color:'#007AFF' },
  card: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    backgroundColor:'#E6F0FF', padding:16, borderRadius:8, marginBottom:12
  },
  time:{ fontSize:16, fontWeight:'500', color:'#333' },
  subText:{ fontSize:14, color:'#555', marginTop:4 },
});

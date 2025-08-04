// screens/DrawerScreens/DVIRScreens/DVIRDetailScreen.js
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DVIRDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dvir = route.params?.dvir;

  if (!dvir) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{ color:'#999' }}>No DVIR selected.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{dvir.time}</Text>
        <View style={{ flexDirection:'row' }}>
          <Ionicons name="create-outline" size={24} color="#007AFF" onPress={()=>navigation.navigate('InsertDVIR',{dvir})}/>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" style={{marginLeft:16}}/>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{dvir.time}</Text>
        <Text style={styles.label}>Vehicle Defect</Text>
        <Text style={styles.value}>{dvir.vDefect}</Text>
        <Text style={styles.label}>Trailer Defect</Text>
        <Text style={styles.value}>{dvir.tDefect}</Text>
        <Text style={[styles.value, { color:'#28A745', marginTop:20 }]}>
          Vehicle Condition Satisfactory
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:16,borderBottomWidth:1,borderColor:'#eee'},
  title:{fontSize:18,fontWeight:'600',color:'#007AFF'},
  content:{padding:16},
  label:{fontSize:14,fontWeight:'500',color:'#007AFF',marginTop:12},
  value:{fontSize:16,color:'#333',marginTop:4},
});

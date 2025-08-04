import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Signature from 'react-native-signature-canvas';

const Tab = createMaterialTopTabNavigator();

// LogsDetailScreen Component
const LogsDetailScreen = () => {
  const graphData = [2, 1, 1, 0]; // Sample hours: OFF, SB, D, ON
  const graphLabels = ['OFF', 'SB', 'D', 'ON'];

  const chartData = {
    labels: graphLabels,
    datasets: [
      {
        data: graphData,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    fillShadowGradient: '#007AFF',
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
    },
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Inspection Preview</Text>
        <Text style={styles.date}>Sun, Apr 20</Text>

        {/* Driver Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Driver Name: <Text style={styles.value}>gagan CME-26</Text></Text>
          <Text style={styles.label}>Driver ID: <Text style={styles.value}>test12</Text></Text>
          <Text style={styles.label}>Driver License: <Text style={styles.value}>BH123D43Q</Text></Text>
          <Text style={styles.label}>License State: <Text style={styles.value}>Alabama</Text></Text>
          <Text style={styles.label}>Exempt Driver Status: <Text style={styles.value}>No</Text></Text>
          <Text style={styles.label}>Unidentified Driving Records: <Text style={styles.value}>No</Text></Text>
          <Text style={styles.label}>Co-Driver: <Text style={styles.value}>-</Text></Text>
        </View>

        {/* Log Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Log Date: <Text style={styles.value}>04/20/2025</Text></Text>
          <Text style={styles.label}>Display Date: <Text style={styles.value}>04/20/2025</Text></Text>
          <Text style={styles.label}>Display Location: <Text style={styles.value}>Location</Text></Text>
          <Text style={styles.label}>Driver Certified: <Text style={styles.value}>No</Text></Text>
        </View>

        {/* ELD Info */}
        <View style={styles.section}>
          <Text style={styles.label}>ELD Registration ID: <Text style={styles.value}>N87C</Text></Text>
          <Text style={styles.label}>ELD Identifier: <Text style={styles.value}>MRS201</Text></Text>
          <Text style={styles.label}>Provider: <Text style={styles.value}>MyLogs</Text></Text>
          <Text style={styles.label}>Data Diag. Indicators: <Text style={styles.value}>No</Text></Text>
          <Text style={styles.label}>Data Malfn. Indicators: <Text style={styles.value}>No</Text></Text>
          <Text style={styles.label}>24 Period Start Time: <Text style={styles.value}>00:00</Text></Text>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Odometer: <Text style={styles.value}>0.0 - 0.0</Text></Text>
          <Text style={styles.label}>Distance: <Text style={styles.value}>0.0</Text></Text>
          <Text style={styles.label}>Engine Hours: <Text style={styles.value}>0.0 - 0.0</Text></Text>
          <Text style={styles.label}>Shipping Docs: <Text style={styles.value}>test</Text></Text>
          <Text style={styles.label}>Carrier: <Text style={styles.value}>test</Text></Text>
          <Text style={styles.label}>Main Office: <Text style={styles.value}>test</Text></Text>
          <Text style={styles.label}>Home Terminal: <Text style={styles.value}>werwer</Text></Text>
        </View>

        {/* Chart */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Driver Activity (in hours)</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
            showValuesOnTopOfBars
            style={{ borderRadius: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Form Screen Component
const FormScreen = () => {
  const [formData, setFormData] = useState({
    driver: 'John Doe',
    vehicle: 'Truck 101',
    trailers: 'Trailer A1',
    shippingDoc: 'DOC123456',
    coDriver: 'Jane Smith'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    Alert.alert(
      'Form Submitted',
      'Your log entry has been saved successfully',
      [{ text: 'OK' }]
    );
    console.log('Form submitted:', formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Logs Entry Form</Text>
        
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Driver</Text>
          <TextInput
            style={styles.input}
            value={formData.driver}
            onChangeText={(text) => handleInputChange('driver', text)}
            placeholder="Enter driver name"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Vehicle</Text>
          <TextInput
            style={styles.input}
            value={formData.vehicle}
            onChangeText={(text) => handleInputChange('vehicle', text)}
            placeholder="Enter vehicle number"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Trailers</Text>
          <TextInput
            style={styles.input}
            value={formData.trailers}
            onChangeText={(text) => handleInputChange('trailers', text)}
            placeholder="Enter trailer number"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Shipping Document</Text>
          <TextInput
            style={styles.input}
            value={formData.shippingDoc}
            onChangeText={(text) => handleInputChange('shippingDoc', text)}
            placeholder="Enter shipping document"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Co-Driver</Text>
          <TextInput
            style={styles.input}
            value={formData.coDriver}
            onChangeText={(text) => handleInputChange('coDriver', text)}
            placeholder="Enter co-driver name"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Save Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Certify Screen Component
const CertifyScreen = () => {
  const [signature, setSignature] = useState(null);
  const [date] = useState('04/20/2025');
  const signatureRef = React.useRef();

  const handleSignature = (signature) => {
    setSignature(signature);
    console.log('Signature saved');
  };

  const handleClear = () => {
    signatureRef.current.clearSignature();
    setSignature(null);
  };

  const handleConfirm = () => {
    if (!signature) {
      Alert.alert('Error', 'Please provide your signature before certifying');
      return;
    }
    Alert.alert(
      'Logs Certified',
      'Your logs have been successfully certified',
      [{ text: 'OK' }]
    );
    console.log('Logs certified with signature:', signature);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Certify Logs</Text>
        
        <View style={styles.signatureContainer}>
          <Text style={styles.signatureLabel}>Your Signature</Text>
          <View style={styles.signatureBox}>
            <Signature
              ref={signatureRef}
              onOK={handleSignature}
              onClear={handleClear}
              descriptionText="Sign above"
              clearText="Clear"
              confirmText="Save"
              webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
              style={styles.signaturePad}
            />
          </View>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>Reset Signature</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.certifyText}>
          I hereby declare that my data entries and my record of duty for this 24-hour period are true and correct.
        </Text>

        <TouchableOpacity 
          style={styles.certifyButton}
          onPress={handleConfirm}
        >
          <Text style={styles.certifyButtonText}>Certify Logs</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Main LogsScreen with Tab Navigation
const LogsScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#555',
        tabBarIndicatorStyle: {
          backgroundColor: '#007AFF',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 2,
        },
      }}
    >
      <Tab.Screen name="Logs" component={LogsDetailScreen} />
      <Tab.Screen name="Form" component={FormScreen} />
      <Tab.Screen name="Certify" component={CertifyScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
  graphContainer: {
    marginTop: 20,
    paddingBottom: 30,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginTop: 5,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signatureContainer: {
    marginBottom: 20,
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  signatureBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    height: 200,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  signaturePad: {
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  certifyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  certifyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  certifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogsScreen;
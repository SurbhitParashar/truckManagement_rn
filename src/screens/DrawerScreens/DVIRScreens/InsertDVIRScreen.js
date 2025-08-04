import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Signature from 'react-native-signature-canvas';

export default function InsertDVIRScreen({ navigation }) {
  const [form, setForm] = useState({
    time: new Date().toLocaleString(),
    location: '',
    odometer: '',
    vehicle: '123',
    vDefect: '',
    trailer: '',
    tDefect: '',
    company: '',
    remarks: '',
    status: 'Vehicle Condition Satisfactory',
    signature: null,
  });

  const sigRef = useRef();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const handleSignature = signature => handleChange('signature', signature);
  const handleClear = () => {
    sigRef.current.clearSignature();
    handleChange('signature', null);
  };
  const handleSubmit = () => {
    // Handle submit logic here (e.g., send to backend or Firebase)
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      {/* <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled}> */}
        <View style={styles.row}>
          <CompactInput label="Time" value={form.time} editable={false} />
          <CompactInput label="Odometer" value={form.odometer} onChangeText={v => handleChange('odometer', v)} keyboardType="numeric" />
        </View>

        <CompactInput label="Location" value={form.location} onChangeText={v => handleChange('location', v)} />
        <CompactInput label="Company" value={form.company} onChangeText={v => handleChange('company', v)} />
        <CompactInput label="Remarks" value={form.remarks} onChangeText={v => handleChange('remarks', v)} />
        <CompactInput label="Status" value={form.status} onChangeText={v => handleChange('status', v)} />

        <View style={styles.row}>
          <CompactInput label="Vehicle" value={form.vehicle} onChangeText={v => handleChange('vehicle', v)} />
          <PickerBox label="V Defect" value={form.vDefect} onChange={v => handleChange('vDefect', v)} />
        </View>

        <View style={styles.row}>
          <CompactInput label="Trailer" value={form.trailer} onChangeText={v => handleChange('trailer', v)} />
          <PickerBox label="T Defect" value={form.tDefect} onChange={v => handleChange('tDefect', v)} />
        </View>

        <Text style={styles.label}>Signature</Text>
        <View style={styles.signature}>
          <Signature
            ref={sigRef}
            onOK={handleSignature}
            onBegin={() => setScrollEnabled(false)}
            onEnd={() => setScrollEnabled(true)}
            autoClear={false}
            webStyle={sigStyle} // removes footer buttons
          />
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearText}>CLEAR SIGNATURE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>SUBMIT</Text>
        </TouchableOpacity>
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
}

const CompactInput = ({ label, value, onChangeText, keyboardType = 'default', editable = true }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
      placeholder={label}
    />
  </View>
);

const PickerBox = ({ label, value, onChange }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={styles.picker}
    >
      <Picker.Item label="Select" value="" />
      <Picker.Item label="Brake Failure" value="Brake Failure" />
      <Picker.Item label="Tire Failure" value="Tire Failure" />
      <Picker.Item label="Steering Failure" value="Steering Failure" />
      <Picker.Item label="Missing Light" value="Missing Light" />
      <Picker.Item label="Mirrors" value="Mirrors" />
    </Picker>
  </View>
);

// Hide the signature pad buttons (Save / Clear footer)
const sigStyle = `
  .m-signature-pad {
    border: 1px solid #007AFF;
    border-radius: 4px;
    height: 120px;
  }
  .m-signature-pad--footer {
    display: none;
  }
`;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  inputBlock: {
    marginBottom: 8,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 4,
    padding: 6,
    fontSize: 12,
  },
  picker: {
    height: 40,
    backgroundColor: '#f0f8ff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  signature: {
    height: 130,
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: '#8e8eff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

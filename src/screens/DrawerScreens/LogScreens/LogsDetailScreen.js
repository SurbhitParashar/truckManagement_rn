// src/screens/LogsScreen.js
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Signature from "react-native-signature-canvas";
import { useUser } from "../../../context/User";  

// 🔹 import cache + eventbus
import EldBleCache from "../../../services/EldBleCache";
import EventBus from "../../../services/EventBus";

const Tab = createMaterialTopTabNavigator();

import { saveFormForDate, certifyLocalLog } from "../../../services/LogManager";
import { startLogSync } from "../../../services/SyncServices";

//////////////////////////
// Logs Tab (Preview)
//////////////////////////

const handleSubmit = async () => {
  const logDate = route?.params?.log?.date || (new Date()).toISOString().split('T')[0];
  await saveFormForDate(user.id, logDate, formData);
  Alert.alert('Form Saved', 'Saved locally. It will sync when internet is available.');
  // optionally trigger immediate sync
  startLogSync({ getDriverUsername: () => user.id });
};

const LogsDetailScreen = ({ route }) => {
  const { log } = route.params || {};
  const events = log?.events || [];
  const date = log?.date || "";

  const { driver } = useUser(); // driver profile from backend

  // 🔹 Local state for BLE values
  const [eldValues, setEldValues] = useState({
  odometer: EldBleCache.getLastOdometer() || "–",
  engineHours: EldBleCache.getLastEngineHours() || "–",
  speed: EldBleCache.getLastSpeed() || "–",
  identifier: EldBleCache.getLastId() || "–",
});


  // subscribe to live updates
  useEffect(() => {
    const updateOdo = (v) => setEldValues((p) => ({ ...p, odometer: v }));
    const updateEng = (v) => setEldValues((p) => ({ ...p, engineHours: v }));
    const updateSpeed = (v) => setEldValues((p) => ({ ...p, speed: v }));
    const updateId = (v) => setEldValues((p) => ({ ...p, identifier: v }));

    EventBus.on("eld:odometer", updateOdo);
    EventBus.on("eld:engineHours", updateEng);
    EventBus.on("speed", updateSpeed);
    EventBus.on("eld:identifier", updateId);

    return () => {
      EventBus.off("eld:odometer", updateOdo);
      EventBus.off("eld:engineHours", updateEng);
      EventBus.off("speed", updateSpeed);
      EventBus.off("eld:identifier", updateId);
    };
  }, []);

  const safe = (v) => (v !== undefined && v !== null && v !== "" ? v : "–");

  // Group status hours (same as before)
  const statusHours = useMemo(() => {
    const totals = { OFF_DUTY: 0, SLEEPER: 0, DRIVE: 0, ON_DUTY: 0 };
    for (let i = 0; i < events.length; i++) {
      const curr = events[i];
      const next = events[i + 1];
      if (!next) continue;
      const durationHrs =
        (new Date(next.time) - new Date(curr.time)) / (1000 * 60 * 60);
      if (totals[curr.status] !== undefined) {
        totals[curr.status] += durationHrs;
      }
    }
    Object.keys(totals).forEach((k) => {
      totals[k] = Number(totals[k].toFixed(1));
    });
    return totals;
  }, [events]);

  const graphLabels = ["OFF", "SB", "D", "ON"];
  const graphData = [
    statusHours.OFF_DUTY,
    statusHours.SLEEPER,
    statusHours.DRIVE,
    statusHours.ON_DUTY,
  ];
  const chartData = { labels: graphLabels, datasets: [{ data: graphData }] };
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    fillShadowGradient: "#007AFF",
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
    propsForBackgroundLines: { strokeDasharray: "" },
  };
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Inspection Preview</Text>
        <Text style={styles.date}>{date || "–"}</Text>

        {/* Driver Info */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Driver Name:{" "}
            <Text style={styles.value}>
              {driver ? `${safe(driver.first_name)} ${safe(driver.last_name)}` : "–"}
            </Text>
          </Text>
          <Text style={styles.label}>
            Driver ID: <Text style={styles.value}>{safe(driver?.username)}</Text>
          </Text>
          <Text style={styles.label}>
            Driver License:{" "}
            <Text style={styles.value}>{safe(driver?.license_number)}</Text>
          </Text>
          <Text style={styles.label}>
            License State: <Text style={styles.value}>{safe(driver?.state)}</Text>
          </Text>
          <Text style={styles.label}>
            Exempt Driver Status:{" "}
            <Text style={styles.value}>{driver?.exempt_driver ? "Yes" : "No"}</Text>
          </Text>
          <Text style={styles.label}>
            Unidentified Driving Records: <Text style={styles.value}>–</Text>
          </Text>
          <Text style={styles.label}>
            Co-Driver: <Text style={styles.value}>–</Text>
          </Text>
        </View>

        {/* Log Info */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Log Date: <Text style={styles.value}>{safe(log?.date)}</Text>
          </Text>
          <Text style={styles.label}>
            Display Date: <Text style={styles.value}>{safe(log?.date)}</Text>
          </Text>
          <Text style={styles.label}>
            Display Location: <Text style={styles.value}>–</Text>
          </Text>
          <Text style={styles.label}>
            Driver Certified: <Text style={styles.value}>No</Text>
          </Text>
        </View>

        {/* ELD Info */}
        <View style={styles.section}>
          <Text style={styles.label}>
            ELD Registration ID: <Text style={styles.value}>–</Text>
          </Text>
          <Text style={styles.label}>
            ELD Identifier: <Text style={styles.value}>{safe(eldValues.identifier)}</Text>
          </Text>
          <Text style={styles.label}>
            Provider: <Text style={styles.value}>{safe(driver?.added_by_company_name)}</Text>
          </Text>
          <Text style={styles.label}>
            Data Diag. Indicators: <Text style={styles.value}>No</Text>
          </Text>
          <Text style={styles.label}>
            Data Malfn. Indicators: <Text style={styles.value}>No</Text>
          </Text>
          <Text style={styles.label}>
            24 Period Start Time: <Text style={styles.value}>00:00</Text>
          </Text>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Odometer: <Text style={styles.value}>{safe(eldValues.odometer)}</Text>
          </Text>
          <Text style={styles.label}>
            Distance: <Text style={styles.value}>–</Text>
          </Text>
          <Text style={styles.label}>
            Engine Hours: <Text style={styles.value}>{safe(eldValues.engineHours)}</Text>
          </Text>
          <Text style={styles.label}>
            Shipping Docs: <Text style={styles.value}>–</Text>
          </Text>
          <Text style={styles.label}>
            Carrier: <Text style={styles.value}>{safe(driver?.cargo_type)}</Text>
          </Text>
          <Text style={styles.label}>
            Main Office: <Text style={styles.value}>{safe(driver?.added_by_company_name)}</Text>
          </Text>
          <Text style={styles.label}>
            Home Terminal: <Text style={styles.value}>{safe(driver?.home_terminal)}</Text>
          </Text>
        </View>

        {/* Chart */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Driver Activity (in hours)</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={{ borderRadius: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


//////////////////////////
// Form Tab
//////////////////////////
const FormTab = ({ route }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    driver: "",
    vehicle: "",
    trailers: "",
    shippingDoc: "",
    coDriver: "",
  });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      const logDate =
        route?.params?.log?.date || new Date().toISOString().split("T")[0];
      await saveFormForDate(user.id, logDate, formData);

      Alert.alert(
        "Form Saved",
        "Saved locally. It will sync when internet is available."
      );

      // trigger sync immediately
      startLogSync({ getDriverUsername: () => user.id });
    } catch (err) {
      console.warn("❌ Failed to save form", err);
      Alert.alert("Error", "Could not save form");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Logs Entry Form</Text>
        {Object.keys(formData).map((field) => (
          <View key={field} style={styles.formSection}>
            <Text style={styles.formLabel}>{field}</Text>
            <TextInput
              style={styles.input}
              value={formData[field]}
              placeholder={`Enter ${field}`}
              onChangeText={(text) => handleChange(field, text)}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};



//////////////////////////
// Certify Tab
//////////////////////////




const CertifyTab = ({ route }) => {
  const { user } = useUser();
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleSignature = (sig) => {
    setSignature(sig);
    console.log("✅ Signature saved locally (base64)");
  };

  const handleClear = () => {
    signatureRef.current.clearSignature();
    setSignature(null);
  };

  const handleConfirm = async () => {
    if (!signature) {
      Alert.alert("Error", "Please provide your signature before certifying");
      return;
    }
    try {
      const logDate =
        route?.params?.log?.date || new Date().toISOString().split("T")[0];
      await certifyLocalLog(
        user.id,
        logDate,
        signature,
        user.name || user.id
      );

      Alert.alert(
        "Logs Certified",
        "Signature saved locally and will sync when internet is available."
      );

      // trigger sync immediately
      startLogSync({ getDriverUsername: () => user.id });
    } catch (err) {
      console.warn("❌ Failed to certify log", err);
      Alert.alert("Error", "Could not certify log");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        scrollEnabled={scrollEnabled}
      >
        <Text style={styles.title}>Certify Logs</Text>

        <View style={styles.signatureContainer}>
          <Text style={styles.signatureLabel}>Your Signature</Text>
          <View style={styles.signatureBox}>
            <Signature
              ref={signatureRef}
              onOK={handleSignature}
              onBegin={() => setScrollEnabled(false)}
              onEnd={() => setScrollEnabled(true)}
              onClear={handleClear}
              descriptionText="Sign above"
              clearText="Clear"
              confirmText="Save"
              webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
              style={styles.signaturePad}
            />
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Reset Signature</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.certifyText}>
          I hereby declare that my data entries and my record of duty for this
          24-hour period are true and correct.
        </Text>

        <TouchableOpacity style={styles.certifyButton} onPress={handleConfirm}>
          <Text style={styles.certifyButtonText}>Certify Logs</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};




//////////////////////////
// Main Screen (Tabs)
//////////////////////////
export default function LogsScreen({ route }) {
  const { log } = route.params || {};
  return (
    <Tab.Navigator
          screenOptions={{
        swipeEnabled: false,   // ✅ Disable swipe between tabs
      }}
>
      <Tab.Screen name="Logs" component={LogsDetailScreen} initialParams={{ log }} />
      <Tab.Screen name="Form" component={FormTab} />
      <Tab.Screen name="Certify" component={CertifyTab} />
    </Tab.Navigator>
  );
}

//////////////////////////
// Styles
//////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  date: { textAlign: 'center', marginBottom: 20 },
  section: { marginBottom: 15 },
  label: { fontWeight: '600' },
  value: { fontWeight: '400' },
  graphContainer: { marginVertical: 20 },
  graphTitle: { textAlign: 'center', marginBottom: 10 },
  formSection: { marginBottom: 15 },
  formLabel: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6 },
  submitButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 10 },
  submitButtonText: { color: '#fff', textAlign: 'center' },
  certifyButton: { backgroundColor: 'green', padding: 15, borderRadius: 8 },
  certifyButtonText: { color: '#fff', textAlign: 'center' },
  scroll: { padding: 20, paddingBottom: 60 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  signatureContainer: { marginBottom: 20 },
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
    overflow: 'hidden',
  },
  signaturePad: { flex: 1 },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  clearButtonText: { color: '#fff', fontWeight: 'bold' },
  certifyText: {
    fontSize: 15,
    color: '#444',
    marginTop: 20,
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'center',
  },
  certifyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  certifyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

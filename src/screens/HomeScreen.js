import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Modal,
  Animated,
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

const CircularTimer = ({ size, strokeWidth, progress, color, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress * circumference);
  
  const animatedProgress = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  }, [progress]);

  const strokeDashoffsetAnim = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - (progress * circumference)]
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={color} stopOpacity="1" />
            <Stop offset="1" stopColor={lightenColor(color, 30)} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* Background Circle */}
        <Circle
          stroke="#F0F0F0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <AnimatedCircle
          stroke="url(#grad)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffsetAnim}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute' }}>
        {children}
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

const statusOptions = [
  { label: 'Driving', value: 'DRIVING', color: '#4CAF50', icon: 'directions-car' },
  { label: 'On Duty', value: 'ON_DUTY', color: '#2196F3', icon: 'work' },
  { label: 'Sleeper', value: 'SLEEPER', color: '#9C27B0', icon: 'hotel' },
  { label: 'Break', value: 'BREAK', color: '#FF9800', icon: 'free-breakfast' },
];

const HomeScreen = ({ navigation }) => {
  const [currentStatus, setCurrentStatus] = useState(statusOptions[2]); // Default to Sleeper
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Sample data for the HOS timers with progress values (0-1)
  const hosData = [
    { 
      label: 'DRIVE', 
      value: '11:00:00', 
      description: '11-Hour Driving Limit',
      progress: 1.0,
      color: '#4CAF50',
      icon: 'directions-car'
    },
    { 
      label: 'Shift', 
      value: '14:00:00', 
      description: '14-Hour On Duty Limit',
      progress: 0.85,
      color: '#2196F3',
      icon: 'schedule'
    },
    { 
      label: 'Break', 
      value: '08:00:00', 
      description: '30 Minute Reset Break',
      progress: 0.7,
      color: '#FF9800',
      icon: 'free-breakfast'
    },
    { 
      label: 'Cycle', 
      value: '70:00:00', 
      description: 'USA 70/8',
      progress: 0.65,
      color: '#9C27B0',
      icon: 'autorenew'
    },
  ];

  const toggleStatusDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };

  const selectStatus = (status) => {
    setCurrentStatus(status);
    setShowStatusDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animatable.View 
        animation="fadeInDown"
        duration={800}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.subtitle}>Current Driver</Text>
            <Text style={styles.title}>Gagan CME-26 | A1</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bluetooth" size={24} color="#fff" />
              
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="location-on" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>

      <ScrollView style={styles.contentContainer}>
        {/* Main timer with status dropdown */}
        <Animatable.View 
          style={styles.timerContainer}
        >
          <Text style={styles.timerLabel}>Remaining Time</Text>
          <CircularTimer 
            size={200} 
            strokeWidth={18} 
            progress={0.75} 
            color={currentStatus.color}
          >
            <Text style={styles.timer}>00:00:00</Text>
            <TouchableOpacity 
              style={styles.statusContainer} 
              onPress={toggleStatusDropdown}
            >
              <View style={[styles.statusIndicator, {backgroundColor: currentStatus.color}]} />
              <Text style={styles.status}>{currentStatus.label.toUpperCase()}</Text>
              <Icon name={showStatusDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#555" />
            </TouchableOpacity>
          </CircularTimer>

          {/* Status dropdown */}
          <Modal
            transparent={true}
            visible={showStatusDropdown}
            animationType="fade"
            onRequestClose={() => setShowStatusDropdown(false)}
          >
            <TouchableOpacity 
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPressOut={() => setShowStatusDropdown(false)}
            >
              <View style={styles.dropdownContainer}>
                {statusOptions.map((status, index) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.dropdownItem,
                      index !== statusOptions.length - 1 && styles.dropdownItemBorder
                    ]}
                    onPress={() => selectStatus(status)}
                  >
                    <Icon name={status.icon} size={20} color={status.color} />
                    <Text style={styles.dropdownItemText}>{status.label}</Text>
                    {currentStatus.value === status.value && (
                      <Icon name="check" size={20} color={status.color} style={styles.dropdownItemCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </Animatable.View>
        
        {/* Section header */}
        <Animatable.View 
          animation="fadeInRight" 
          duration={600}
          style={styles.sectionDivider}
        >
          <View style={styles.dividerLine} />
          <View style={styles.sectionTitleContainer}>
            <Icon name="timer" size={20} color="#555" />
            <Text style={styles.sectionTitle}>Hours of Service</Text>
          </View>
          <View style={styles.dividerLine} />
        </Animatable.View>

        {/* Timer grid */}
        <View style={styles.timerGrid}>
          {hosData.map((item, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              duration={800}
              delay={index * 100}
              style={[
                styles.timerItem,
                index % 2 === 0 && styles.rightBorder,
                index < 2 && styles.bottomBorder
              ]}
            >
              <View style={styles.timerIconContainer}>
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <CircularTimer 
                size={100} 
                strokeWidth={10} 
                progress={item.progress} 
                color={item.color}
              >
                <Text style={styles.circleValue}>{item.value}</Text>
              </CircularTimer>
              <View style={styles.timerItemLabels}>
                <Text style={styles.timerItemTitle}>{item.label}</Text>
                <Text style={styles.timerItemDescription}>{item.description}</Text>
              </View>
            </Animatable.View>
          ))}
        </View>

        {/* Logout button */}
        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={400}
        >
          <TouchableOpacity style={styles.logoutButton}>
            <Icon name="power-settings-new" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  headerContainer: {
    backgroundColor: '#1a237e',
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  headerTextContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#fff'
  },
  headerIcons: { 
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    marginLeft: 20,
    position: 'relative'
  },
  notificationBadge: {
    position: 'absolute',
    right: -3,
    top: -3,
    backgroundColor: '#ff5252',
    width: 10,
    height: 10,
    borderRadius: 4
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timerLabel: { 
    fontSize: 16, 
    color: '#555',
    marginBottom: 8,
    fontWeight: '600'
  },
  timer: { 
    fontSize: 32, 
    color: '#1a237e', 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  status: { 
    fontSize: 16, 
    textAlign: 'center',
    fontWeight: '600',
    color: '#555',
    marginRight: 5,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    flex: 1,
  },
  dropdownItemCheck: {
    marginLeft: 10,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#333'
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  timerItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  timerIconContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 5,
    borderRadius: 20,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timerItemLabels: {
    alignItems: 'center',
    marginTop: 8,
  },
  timerItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timerItemDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 4,
  },
  circleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
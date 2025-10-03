// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDriverByUsername } from "../api/driverService";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);      // { id, name, token }
  const [driver, setDriver] = useState(null);  // driver profile
  const [loading, setLoading] = useState(true);

  // Restore offline data
  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        const savedDriver = await AsyncStorage.getItem("driver");

        if (savedUser) {
          console.log("🔹 Restored user from storage:", savedUser);
          setUser(JSON.parse(savedUser));
        } else {
          console.log("⚠️ No user found in storage");
        }

        if (savedDriver) {
          console.log("🔹 Restored driver from storage:", savedDriver);
          setDriver(JSON.parse(savedDriver));
        } else {
          console.log("⚠️ No driver found in storage");
        }
      } catch (err) {
        console.warn("❌ Restore user/driver failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Keep user in storage
  useEffect(() => {
    if (user) {
      // console.log("💾 Saving user to storage:", user);
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Keep driver in storage
  useEffect(() => {
    if (driver) {
      // console.log("💾 Saving driver to storage:", driver);
      AsyncStorage.setItem("driver", JSON.stringify(driver));
    }
  }, [driver]);

  // Load driver profile from backend
  // Load driver profile from backend
const loadDriverProfile = async (username) => {
  try {
    // console.log("🌐 Fetching driver profile for:", username);
    const profile = await getDriverByUsername(username);

    if (profile) {
      // console.log("✅ Driver profile fetched from backend:", profile);
      setDriver(profile);
      await AsyncStorage.setItem("driver", JSON.stringify(profile));

      // 🔹 Also inject driverId into user object
      setUser((prev) => {
        if (!prev) return prev;
        const updatedUser = { ...prev, driverId: profile.id };
        AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        // console.log("💾 Updated user with driverId:", updatedUser);
        return updatedUser;
      });
    } else {
      console.log("⚠️ Backend returned no driver profile for:", username);
    }
  } catch (err) {
    console.warn(
      "❌ Failed to fetch driver profile, falling back to offline cache",
      err
    );
  }
};


  return (
    <UserContext.Provider
      value={{ user, setUser, driver, setDriver, loadDriverProfile, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

// Simple in-memory cache for latest ELD values
// Updated by EldBleService via EventBus, read by LogManager or other modules

class EldBleCache {
  constructor() {
    this.identifier = null;
    this.odometer = null;
    this.speed = null;
    this.engineHours = null;
  }

  // setters (called when new values arrive)
  setIdentifier(id) { this.identifier = id; }
  setOdometer(val) { this.odometer = val; }
  setSpeed(val) { this.speed = val; }
  setEngineHours(val) { this.engineHours = val; }

  // getters (used by LogManager or UI)
  getLastId() { return this.identifier; }
  getLastOdometer() { return this.odometer; }
  getLastSpeed() { return this.speed; }
  getLastEngineHours() { return this.engineHours; }
}

// export singleton instance
export default new EldBleCache();

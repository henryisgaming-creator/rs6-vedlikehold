// Category icons and styling
export const getCategoryIcon = (category) => {
  const icons = {
    'Motor': '🔧',
    'Transmission': '⚙️',
    'Suspension': '🚗',
    'Brakes': '🛑',
    'Electrical': '⚡',
    'Cooling': '❄️',
    'Fuel System': '⛽',
    'Exhaust': '💨',
    'Interior': '🪑',
    'Exterior': '🎨',
    'Maintenance': '🛠️',
    'Custom': '⭐'
  };
  return icons[category] || '📋';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Motor': '#ef4444',        // Red
    'Transmission': '#f97316',  // Orange
    'Suspension': '#eab308',    // Yellow
    'Brakes': '#dc2626',        // Dark Red
    'Electrical': '#06b6d4',    // Cyan
    'Cooling': '#0ea5e9',       // Sky Blue
    'Fuel System': '#f43f5e',   // Rose
    'Exhaust': '#8b5cf6',       // Purple
    'Interior': '#a16207',      // Brown
    'Exterior': '#0d9488',      // Teal
    'Maintenance': '#6366f1',   // Indigo
    'Custom': '#10b981'         // Green
  };
  return colors[category] || '#3b82f6';
};

export const getStatusIcon = (status) => {
  const icons = {
    'Overdue': '❌',
    'Due Soon': '⚠️',
    'OK': '✅',
    'New': '🆕'
  };
  return icons[status] || '❓';
};

export const calculateDaysUntilDue = (lastChanged, intervalYears, currentKm, lastKm, intervalKm) => {
  // Return null if critical data is missing
  if (!lastChanged && (!lastKm || lastKm === 0)) return null;
  
  let daysDue = null;
  let kmDue = null;
  let daysElapsed = null;
  let kmElapsed = null;
  
  // Calculate days only if lastChanged is a valid date
  if (lastChanged && lastChanged.length > 4) {  // More than just a year
    const lastDate = new Date(lastChanged);
    // Check if date is valid
    if (!isNaN(lastDate.getTime())) {
      const today = new Date();
      daysElapsed = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      if (intervalYears && intervalYears > 0) {
        daysDue = (intervalYears * 365) - daysElapsed;
      }
    }
  }
  
  // Calculate km only if lastKm is valid and not null
  if (lastKm && lastKm > 0 && currentKm && currentKm > 0 && intervalKm && intervalKm > 0) {
    kmElapsed = currentKm - lastKm;
    kmDue = intervalKm - kmElapsed;
  }
  
  // Return null if we have no valid calculations
  if (daysDue === null && kmDue === null) return null;
  
  return { daysDue, kmDue, daysElapsed, kmElapsed };
};

export const getUrgencyStatus = (lastChanged, intervalYears, currentKm, lastKm, intervalKm) => {
  const calc = calculateDaysUntilDue(lastChanged, intervalYears, currentKm, lastKm, intervalKm);
  if (!calc) return 'New';
  
  const { daysDue, kmDue } = calc;
  
  // Check if either metric indicates overdue
  if ((daysDue !== null && daysDue < 0) || (kmDue !== null && kmDue < 0)) {
    return 'Overdue';
  } else if ((daysDue !== null && daysDue < 30) || (kmDue !== null && kmDue < 500)) {
    return 'Due Soon';
  } else {
    return 'OK';
  }
};

export const getUrgencyColor = (status) => {
  const colors = {
    'Overdue': '#dc2626',    // Red
    'Due Soon': '#f59e0b',   // Amber
    'OK': '#10b981'          // Green
  };
  return colors[status] || '#6b7280';
};

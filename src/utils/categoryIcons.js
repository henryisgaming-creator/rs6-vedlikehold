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
  if (!lastChanged) return null;
  
  const lastDate = new Date(lastChanged);
  const today = new Date();
  const daysElapsed = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  const daysDue = (intervalYears * 365) - daysElapsed;
  
  const kmElapsed = currentKm - lastKm;
  const kmDue = intervalKm - kmElapsed;
  
  return { daysDue, kmDue, daysElapsed, kmElapsed };
};

export const getUrgencyStatus = (lastChanged, intervalYears, currentKm, lastKm, intervalKm) => {
  const calc = calculateDaysUntilDue(lastChanged, intervalYears, currentKm, lastKm, intervalKm);
  if (!calc) return 'New';
  
  const { daysDue, kmDue } = calc;
  
  if (daysDue < 0 || kmDue < 0) {
    return 'Overdue';
  } else if (daysDue < 30 || kmDue < 500) {
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

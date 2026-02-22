// Category icons and styling
export const getCategoryIcon = (category) => {
  // Try to match by keywords to support multiple languages / naming
  if (!category) return '📋';
  const c = category.toLowerCase();
  if (c.includes('motor') || c.includes('driv') || c.includes('engine')) return '🔧';
  if (c.includes('trans') || c.includes('gear')) return '⚙️';
  if (c.includes('susp') || c.includes('fjær') || c.includes('støtdemper')) return '🚗';
  if (c.includes('brem') || c.includes('brake')) return '🛑';
  if (c.includes('elektr') || c.includes('elektrisk') || c.includes('elec')) return '⚡';
  if (c.includes('køl') || c.includes('cool')) return '❄️';
  if (c.includes('drivstoff') || c.includes('fuel') || c.includes('tank')) return '⛽';
  if (c.includes('eksos') || c.includes('exhaust')) return '💨';
  if (c.includes('interi') || c.includes('interior')) return '🪑';
  if (c.includes('eksteri') || c.includes('exteri') || c.includes('paint')) return '🎨';
  if (c.includes('tenn') || c.includes('coil') || c.includes('spark') || c.includes('plug')) return '🔩';
  if (c.includes('vedlikehold') || c.includes('maintenance')) return '🛠️';
  if (c.includes('custom') || c.includes('egendefinert')) return '⭐';

  return '📋';
};

export const getCategoryColor = (category) => {
  if (!category) return '#3b82f6';
  const c = category.toLowerCase();
  if (c.includes('motor') || c.includes('driv')) return '#ef4444';
  if (c.includes('trans') || c.includes('gear')) return '#f97316';
  if (c.includes('susp') || c.includes('fjær') || c.includes('støtdemper')) return '#eab308';
  if (c.includes('brem') || c.includes('brake')) return '#dc2626';
  if (c.includes('elektr') || c.includes('elektrisk')) return '#06b6d4';
  if (c.includes('køl') || c.includes('cool')) return '#0ea5e9';
  if (c.includes('drivstoff') || c.includes('fuel')) return '#f43f5e';
  if (c.includes('eksos') || c.includes('exhaust')) return '#8b5cf6';
  if (c.includes('interi')) return '#a16207';
  if (c.includes('eksteri') || c.includes('exteri')) return '#0d9488';
  if (c.includes('vedlikehold') || c.includes('maintenance')) return '#6366f1';
  if (c.includes('custom') || c.includes('egendefinert')) return '#10b981';
  return '#3b82f6';
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
  if (lastChanged) {
    let lastDate = null;
    
    // Try direct Date parsing first
    lastDate = new Date(lastChanged);
    
    // If parsing failed, try MM.YY format (e.g. "08.25" = August 2025)
    if (isNaN(lastDate.getTime()) && typeof lastChanged === 'string' && lastChanged.includes('.')) {
      const parts = lastChanged.split('.');
      if (parts.length === 2 && parts[0].length <= 2 && parts[1].length <= 2) {
        const month = parseInt(parts[0]);
        let year = parseInt(parts[1]);
        // Assume 20xx for 2-digit years
        if (year < 100) year += 2000;
        if (month >= 1 && month <= 12) {
          lastDate = new Date(year, month - 1, 1);
        }
      }
    }
    
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
  // Treat unknown/missing data as overdue (safety-first approach)
  if (!calc) return 'Overdue';
  
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

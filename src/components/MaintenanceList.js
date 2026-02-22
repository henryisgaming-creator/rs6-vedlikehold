import React, { useMemo } from 'react';
import './MaintenanceList.css';
import { getCategoryIcon, getCategoryColor, getUrgencyStatus, getUrgencyColor, calculateDaysUntilDue } from '../utils/categoryIcons';

function MaintenanceList({ items, onSelectItem, currentKm, serviceHistory = {} }) {
  // Calculate urgency and sort items
  const sortedItems = useMemo(() => {
    const itemsWithUrgency = items.map(item => {
      // Extract intervalKm and intervalYears from the item
      let intervalKm = item.intervalKm || 0;
      let intervalYears = item.intervalYears || 0;
      
      // Try to parse from interval string if not present
      if (!intervalKm && item.interval) {
        const kmMatch = item.interval.match(/(\d+)\s*km/);
        if (kmMatch) intervalKm = parseInt(kmMatch[1]);
      }
      
      if (!intervalYears && item.interval) {
        const yearMatch = item.interval.match(/(\d+(?:\.\d+)?)\s*år/);
        if (yearMatch) intervalYears = parseFloat(yearMatch[1]);
      }
      
      const status = getUrgencyStatus(
        item.lastChanged,
        intervalYears,
        parseInt(currentKm) || 0,
        parseInt(item.kmAtLastChange) || 0,
        intervalKm
      );

      return { item, status };
    });

    // Sort: Overdue first, then Due Soon, then OK
    const urgencyOrder = { 'Overdue': 0, 'Due Soon': 1, 'OK': 2, 'New': 3 };
    return itemsWithUrgency.sort((a, b) => urgencyOrder[a.status] - urgencyOrder[b.status]);
  }, [items, currentKm]);

  // Calculate total cost for an item
  const getItemTotalCost = (category, part) => {
    const key = `${category}|${part}`;
    const records = serviceHistory[key] || [];
    return records.reduce((sum, record) => sum + (record.cost || 0), 0);
  };

  return (
    <div className="maintenance-list">
      {sortedItems.length === 0 ? (
        <div className="no-items">
          <p>📭 Ingen vedlikehold regnet opp</p>
        </div>
      ) : (
        <div className="items-container">
          {sortedItems.map(({ item, status }, index) => {
            const icon = getCategoryIcon(item.category);
            const categoryColor = getCategoryColor(item.category);
            const urgencyColor = getUrgencyColor(status);
            const totalCost = getItemTotalCost(item.category, item.part);
            
            // Parse intervals from string if needed
            let intervalKm = item.intervalKm || 0;
            let intervalYears = item.intervalYears || 0;
            
            if (!intervalKm && item.interval) {
              const kmMatch = item.interval.match(/(\d+)\s*km/);
              if (kmMatch) intervalKm = parseInt(kmMatch[1]);
            }
            
            if (!intervalYears && item.interval) {
              const yearMatch = item.interval.match(/(\d+(?:\.\d+)?)\s*år/);
              if (yearMatch) intervalYears = parseFloat(yearMatch[1]);
            }
            
            const calc = calculateDaysUntilDue(
              item.lastChanged,
              intervalYears,
              parseInt(currentKm) || 0,
              parseInt(item.kmAtLastChange) || 0,
              intervalKm
            );

            return (
              <div
                key={index}
                className={`maintenance-item urgency-${status.toLowerCase().replace(' ', '-')}`}
                onClick={() => onSelectItem(item)}
                style={{ borderLeftColor: urgencyColor }}
              >
                <div className="item-icon" style={{ backgroundColor: categoryColor, color: 'white' }}>
                  {icon}
                </div>
                
                <div className="item-content">
                  <div className="item-header">
                    <h3>{item.part}</h3>
                    <span className="status-badge" style={{ backgroundColor: urgencyColor }}>
                      {status}
                    </span>
                  </div>
                  
                  <p className="item-category">{item.category}</p>
                  
                  {item.interval && (
                    <p className="item-interval">📅 {item.interval}</p>
                  )}

                  {calc && (
                    <div className="item-progress">
                      <div className="progress-info">
                        {status === 'Overdue' && (
                          <span className="urgency-text overdue">
                            ⚠️ {Math.abs(calc.kmDue)} km overskredet
                          </span>
                        )}
                        {status === 'Due Soon' && (
                          <span className="urgency-text due-soon">
                            {calc.kmDue > 0 ? `${calc.kmDue} km igjen` : `${Math.abs(calc.daysDue)} dager overskredet`}
                          </span>
                        )}
                        {status === 'OK' && (
                          <span className="urgency-text ok">
                            ✅ {calc.kmDue} km igjen
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {totalCost > 0 && (
                    <div className="item-cost">
                      💸 {totalCost.toLocaleString('no-NO')} kr
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MaintenanceList;

import React from 'react';
import './MaintenanceList.css';

function MaintenanceList({ items, onSelectItem, currentKm }) {
  const getStatusColor = (status) => {
    if (status.includes('🟢')) return '#4ade80';
    if (status.includes('🟡')) return '#facc15';
    if (status.includes('🔴')) return '#ef4444';
    return '#6b7280';
  };

  const getUrgency = (item, km) => {
    if (!km || !item.nextRecommendedKm) return 'unknown';
    const kmNum = parseInt(km);
    const nextKm = parseInt(item.nextRecommendedKm);
    const remaining = nextKm - kmNum;
    
    if (remaining <= 0) return 'overdue';
    if (remaining <= 5000) return 'urgent';
    if (remaining <= 10000) return 'soon';
    return 'ok';
  };

  return (
    <div className="maintenance-list">
      {items.length === 0 ? (
        <div className="no-items">Ingen varslinger funnet</div>
      ) : (
        items.map((item, index) => {
          const urgency = getUrgency(item, currentKm);
          return (
            <div
              key={index}
              className={`maintenance-item urgency-${urgency}`}
              onClick={() => onSelectItem(item)}
            >
              <div className="item-header">
                <h3>{item.part}</h3>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(item.status) }}>
                  {item.status}
                </span>
              </div>
              <p className="item-category">{item.category}</p>
              <p className="item-interval">{item.interval}</p>
              {item.nextRecommendedKm && currentKm && (
                <div className="item-progress">
                  <p className="urgency-text urgency-{urgency}">
                    {(() => {
                      const remaining = parseInt(item.nextRecommendedKm) - parseInt(currentKm);
                      if (remaining <= 0) {
                        return `⚠️ Overskredet med ${Math.abs(remaining)} km`;
                      } else if (remaining <= 5000) {
                        return `🔴 ${remaining} km igjen`;
                      } else {
                        return `${remaining} km igjen`;
                      }
                    })()}
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MaintenanceList;

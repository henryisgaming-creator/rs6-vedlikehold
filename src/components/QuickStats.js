import React, { useMemo } from 'react';
import './QuickStats.css';
import { getUrgencyStatus } from '../utils/categoryIcons';

function QuickStats({ items, currentKm, serviceHistory }) {
  const stats = useMemo(() => {
    const itemsWithStatus = items.map(item => ({
      ...item,
      urgency: getUrgencyStatus(item, currentKm, serviceHistory)
    }));

    const overdue = itemsWithStatus.filter(i => i.urgency === 'overdue').length;
    const urgent = itemsWithStatus.filter(i => i.urgency === 'urgent').length;
    const soon = itemsWithStatus.filter(i => i.urgency === 'soon').length;
    const ok = itemsWithStatus.filter(i => i.urgency === 'ok').length;

    // Calculate total cost from service history
    let totalCost = 0;
    Object.values(serviceHistory).forEach(records => {
      if (Array.isArray(records)) {
        records.forEach(record => {
          totalCost += record.cost || 0;
        });
      }
    });

    return {
      overdue,
      urgent,
      soon,
      ok,
      totalCost
    };
  }, [items, currentKm, serviceHistory]);

  return (
    <div className="quick-stats">
      <div className={`stat-card overdue ${stats.overdue > 0 ? 'has-items' : ''}`}>
        <div className="stat-icon">⚠️</div>
        <div className="stat-content">
          <div className="stat-number">{stats.overdue}</div>
          <div className="stat-label">Forfalt</div>
        </div>
      </div>

      <div className={`stat-card urgent ${stats.urgent > 0 ? 'has-items' : ''}`}>
        <div className="stat-icon">🔴</div>
        <div className="stat-content">
          <div className="stat-number">{stats.urgent}</div>
          <div className="stat-label">Presserende</div>
        </div>
      </div>

      <div className={`stat-card soon ${stats.soon > 0 ? 'has-items' : ''}`}>
        <div className="stat-icon">🟡</div>
        <div className="stat-content">
          <div className="stat-number">{stats.soon}</div>
          <div className="stat-label">Snart</div>
        </div>
      </div>

      <div className={`stat-card ok ${stats.ok > 0 ? 'has-items' : ''}`}>
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-number">{stats.ok}</div>
          <div className="stat-label">OK</div>
        </div>
      </div>

      <div className="stat-card cost">
        <div className="stat-icon">💸</div>
        <div className="stat-content">
          <div className="stat-number">{stats.totalCost.toLocaleString('no-NO')} kr</div>
          <div className="stat-label">Total kostnad</div>
        </div>
      </div>
    </div>
  );
}

export default QuickStats;

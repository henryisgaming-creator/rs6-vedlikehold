import React, { useState } from 'react';
import EditItemModal from './EditItemModal';
import './MaintenanceDetails.css';

function MaintenanceDetails({ item, currentKm, onClose, onAddServiceRecord, onOpenHistory, serviceHistory, onSaveEdits }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  // Parse date for display (returns string)
  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return 'Ikke registrert';
    if (typeof dateValue === 'number') {
      // Excel date format
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toLocaleDateString('no-NO');
    }
    return dateValue;
  };

  // Parse date for calculations (returns Date object or null)
  const parseDateForCalc = (dateValue) => {
    if (!dateValue) return null;
    
    // Try direct parsing first
    let parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) return parsed;
    
    // Try parsing MM.YY format (e.g. "08.25" = August 2025)
    if (typeof dateValue === 'string' && dateValue.includes('.')) {
      const parts = dateValue.split('.');
      if (parts.length === 2 && parts[0].length <= 2 && parts[1].length <= 2) {
        const month = parseInt(parts[0]);
        let year = parseInt(parts[1]);
        // Assume 20xx for 2-digit years
        if (year < 100) year += 2000;
        if (month >= 1 && month <= 12) {
          parsed = new Date(year, month - 1, 1);
          if (!isNaN(parsed.getTime())) return parsed;
        }
      }
    }
    
    // If parsing failed, return null
    return null;
  };

  const calculateProgress = () => {
    let percentage = null;
    let display = null;
    // If there's service history, prefer the most recent record as last change
    const historyKey = `${editedItem.category || 'custom'}|${editedItem.part}`;
    const hist = serviceHistory && serviceHistory[historyKey] ? serviceHistory[historyKey] : null;
    const latestRecord = hist && hist.length ? hist[hist.length - 1] : null;

    // Calculate based on km if available
    const sourceKmLast = latestRecord && latestRecord.km ? parseInt(latestRecord.km) : (editedItem.kmAtLastChange ? parseInt(editedItem.kmAtLastChange) : null);
    if (editedItem.intervalKm && sourceKmLast && currentKm) {
      const kmNum = parseInt(currentKm);
      const lastKm = sourceKmLast;
      const interval = parseInt(editedItem.intervalKm);
      const kmUsed = kmNum - lastKm;
      percentage = Math.min(100, Math.max(0, (kmUsed / interval) * 100));
      const kmRemaining = interval - kmUsed;
      display = kmRemaining > 0 ? `${kmRemaining} km igjen` : `${Math.abs(kmRemaining)} km overskredet`;
    }
    // Calculate based on years if km not available
    else if (editedItem.intervalYears) {
      const sourceDate = latestRecord && latestRecord.date ? latestRecord.date : editedItem.lastChanged;
      const lastDate = parseDateForCalc(sourceDate);
      if (lastDate && !isNaN(lastDate.getTime())) {
        const today = new Date();
        const daysElapsed = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        const totalDays = editedItem.intervalYears * 365;
        percentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
        const daysRemaining = totalDays - daysElapsed;
        display = daysRemaining > 0 ? `${Math.floor(daysRemaining)} dager igjen` : `${Math.floor(Math.abs(daysRemaining))} dager overskredet`;
      }
    }
    
    if (percentage !== null) {
      const status = percentage >= 100 ? 'overdue' : percentage >= 80 ? 'urgent' : 'ok';
      return { percentage, display, status };
    }
    return null;
  };

  const progressData = calculateProgress();
  const key = `${editedItem.category || 'custom'}|${editedItem.part}`;
  const hasHistory = serviceHistory[key] && serviceHistory[key].length > 0;

  const handleEditSave = (updatedItem) => {
    setEditedItem(updatedItem);
    // Persist edits so comments/interval changes survive reloads
    try {
      const key = `${updatedItem.category || 'custom'}|${updatedItem.part}`;
      const raw = localStorage.getItem('itemOverrides');
      const overrides = raw ? JSON.parse(raw) : {};
      overrides[key] = { ...(overrides[key] || {}), ...updatedItem };
      localStorage.setItem('itemOverrides', JSON.stringify(overrides));
    } catch (err) {
      // ignore storage errors
    }
    if (typeof onSaveEdits === 'function') onSaveEdits(updatedItem);
  };

  return (
    <div className="maintenance-details">
      <button className="back-button" onClick={onClose}>← Tilbake</button>
      
      <div className="details-content-wrapper">
        <div className="details-header">
          <h2>{editedItem.part}</h2>
          <span className="details-category">{editedItem.category}</span>
        </div>

        <div className="details-content">
          <div className="detail-section">
            <h3>Anbefalt intervall</h3>
            {editedItem.intervalKm ? (
              <p className="detail-value">{editedItem.intervalKm} km</p>
            ) : editedItem.intervalYears ? (
              <p className="detail-value">{editedItem.intervalYears} år</p>
            ) : (
              <p className="detail-value">{editedItem.interval || 'Ikke spesifisert'}</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Sist byttet</h3>
            <p className="detail-value">{formatDateForDisplay(editedItem.lastChanged)}</p>
            {editedItem.kmAtLastChange && (
              <p className="detail-subtext">ved {editedItem.kmAtLastChange} km</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Fremgang</h3>
            {progressData ? (
              <>
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${progressData.status}`}
                      style={{ width: `${progressData.percentage}%` }}
                    ></div>
                  </div>
                  <p className={`progress-text ${progressData.status}`}>
                    {progressData.display}
                  </p>
                </div>
              </>
            ) : (
              <p className="detail-value">Ingen data for beregning</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Status</h3>
            <p className="detail-value">{editedItem.status}</p>
          </div>

          {editedItem.comments && (
            <div className="detail-section">
              <h3>Kommentarer</h3>
              <p className="detail-value comments">{editedItem.comments}</p>
            </div>
          )}

          {editedItem.notes && (
            <div className="detail-section">
              <h3>Notater</h3>
              <p className="detail-value">{editedItem.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="details-actions">
        <button 
          className="action-btn edit-btn"
          onClick={() => setShowEditModal(true)}
        >
          ✏️ Rediger
        </button>
        <button 
          className="action-btn history-btn"
          onClick={() => onOpenHistory(editedItem)}
        >
          📋 Historikk {hasHistory && <span className="badge">{serviceHistory[key].length}</span>}
        </button>
      </div>

      {showEditModal && (
        <EditItemModal
          item={editedItem}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default MaintenanceDetails;

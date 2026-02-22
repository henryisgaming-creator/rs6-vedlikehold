import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import EditItemModal from './EditItemModal';
import './MaintenanceDetails.css';

function MaintenanceDetails({ item, currentKm, onClose, onAddServiceRecord, onOpenHistory, serviceHistory }) {
  const contentRef = useRef();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const parseDate = (dateValue) => {
    if (!dateValue) return 'Ikke registrert';
    if (typeof dateValue === 'number') {
      // Excel date format
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toLocaleDateString('no-NO');
    }
    return dateValue;
  };

  const calculateProgress = () => {
    if (!currentKm || !item.nextRecommendedKm) return null;
    const kmNum = parseInt(currentKm);
    const nextKm = parseInt(item.nextRecommendedKm);
    const remaining = nextKm - kmNum;
    const progress = Math.max(0, Math.min(100, ((kmNum - (item.kmAtLastChange || 0)) / item.interval.match(/\d+/)?.[0] || 100) * 100));
    
    return {
      remaining,
      progress,
      status: remaining <= 0 ? 'overdue' : remaining <= 5000 ? 'urgent' : 'ok'
    };
  };

  const handleExportPDF = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${item.part}.pdf`);
  };

  const progressData = calculateProgress();
  const key = `${item.category}|${item.part}`;
  const hasHistory = serviceHistory[key] && serviceHistory[key].length > 0;

  const handleEditSave = (updatedItem) => {
    setEditedItem(updatedItem);
    // In a real app, you would save this to localStorage or a server
    // For now, just update the local state
  };

  return (
    <div className="maintenance-details">
      <button className="back-button" onClick={onClose}>← Tilbake</button>
      
      <div ref={contentRef} className="details-content-wrapper">
        <div className="details-header">
          <h2>{editedItem.part}</h2>
          <span className="details-category">{editedItem.category}</span>
        </div>

        <div className="details-content">
          <div className="detail-section">
            <h3>Anbefalt intervall</h3>
            <p className="detail-value">{editedItem.intervalKm ? `${editedItem.intervalKm} km` : ''} {editedItem.intervalYears ? `/ ${editedItem.intervalYears} år` : ''}</p>
          </div>

          <div className="detail-section">
            <h3>Sist byttet</h3>
            <p className="detail-value">{parseDate(editedItem.lastChanged)}</p>
            {editedItem.kmAtLastChange && (
              <p className="detail-subtext">ved {editedItem.kmAtLastChange} km</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Neste anbefalte bytte</h3>
            <p className="detail-value">{editedItem.nextRecommendedKm || 'Ikke beregnet'} km</p>
            {progressData && (
              <>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${progressData.status}`}
                    style={{ width: `${progressData.progress}%` }}
                  ></div>
                </div>
                <p className={`detail-subtext progress-text ${progressData.status}`}>
                  {progressData.remaining <= 0 
                    ? `⚠️ Overskredet med ${Math.abs(progressData.remaining)} km`
                    : `${progressData.remaining} km igjen`}
                </p>
              </>
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
        <button 
          className="action-btn pdf-btn"
          onClick={handleExportPDF}
        >
          📄 Eksporter PDF
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

import React, { useState } from 'react';
import './ServiceHistoryModal.css';

function ServiceHistoryModal({ item, history, onClose, onAddRecord }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    km: '',
    notes: ''
  });

  const key = `${item.category}|${item.part}`;
  const records = history[key] || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (formData.date && formData.km) {
      onAddRecord(item, formData.date, formData.km, formData.notes);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        km: '',
        notes: ''
      });
      setShowForm(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('no-NO');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item.part}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <h3>Servicehistorikk</h3>
          
          {records.length === 0 ? (
            <p className="no-records">Ingen servicehistorikk registrert</p>
          ) : (
            <div className="history-list">
              {records.map((record, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-date">{formatDate(record.date)}</div>
                  <div className="history-km">{record.km} km</div>
                  {record.notes && <div className="history-notes">{record.notes}</div>}
                </div>
              ))}
            </div>
          )}

          {showForm ? (
            <form onSubmit={handleAddRecord} className="history-form">
              <div className="form-group">
                <label htmlFor="service-date">Dato:</label>
                <input
                  id="service-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="service-km">Km-stand:</label>
                <input
                  id="service-km"
                  type="number"
                  name="km"
                  value={formData.km}
                  onChange={handleInputChange}
                  placeholder="Km"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="service-notes">Notater (valgfritt):</label>
                <textarea
                  id="service-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Beskrivelse av service..."
                  rows="3"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">Lagre</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Avbryt</button>
              </div>
            </form>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Legg til service
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceHistoryModal;

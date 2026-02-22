import React, { useState, useEffect } from 'react';
import './ServiceHistoryModal.css';

function ServiceHistoryModal({ item, history, onClose, onAddRecord, onDeleteRecord, onUpdateRecord }) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    km: '',
    notes: '',
    cost: '',
    images: []
  });
  const [savedMessage, setSavedMessage] = useState(false);

  // Safely create the key, handling missing category
  const key = item ? `${item.category || 'custom'}|${item.part}` : null;
  const records = key ? (history[key] || []) : [];

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { data: base64, name: file.name }]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (formData.date && formData.km) {
      const payload = { date: formData.date, km: formData.km, notes: formData.notes, images: formData.images, cost: parseFloat(formData.cost) || 0 };
      if (editingIndex !== null && typeof onUpdateRecord === 'function') {
        onUpdateRecord(key, editingIndex, payload);
      } else {
        onAddRecord(item, formData.date, formData.km, formData.notes, formData.images, parseFloat(formData.cost) || 0);
      }
      setFormData({
        date: new Date().toISOString().split('T')[0],
        km: '',
        notes: '',
        cost: '',
        images: []
      });
      setShowForm(false);
      setSavedMessage(true);
      setEditingIndex(null);
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
        {!item ? (
          <>
            <div className="modal-header">
              <h2>Feil</h2>
              <button className="modal-close-btn" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body">
              <p>Kunne ikke laste vedliekehold. Prøv igjen.</p>
            </div>
          </>
        ) : (
          <>
            <div className="modal-header">
              <h2>{item.part}</h2>
              <button className="modal-close-btn" onClick={onClose}>✕</button>
            </div>

            <div className="modal-body">
              <h3>Servicehistorikk</h3>
          
          {savedMessage && (
            <div className="saved-message">✅ Service registrert!</div>
          )}
          
          {records.length === 0 ? (
            <p className="no-records">Ingen servicehistorikk registrert</p>
          ) : (
            <div className="history-list">
              {records.map((record, idx) => (
                <div key={idx} className="history-item">
                  <div style={{display: 'flex', justifyContent: 'space-between', gap: 8}}>
                    <div>
                      <div className="history-date">{formatDate(record.date)}</div>
                      <div className="history-km">{record.km} km</div>
                    </div>
                    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                      {record.cost && record.cost > 0 && (
                        <div className="history-cost">💰 {record.cost.toLocaleString('no-NO')} kr</div>
                      )}
                      <button className="btn btn-secondary" onClick={() => onDeleteRecord && onDeleteRecord(key, idx)}>Slett</button>
                      <button className="btn btn-secondary" onClick={() => {
                        setFormData({
                          date: record.date,
                          km: record.km,
                          notes: record.notes || '',
                          cost: record.cost || '',
                          images: record.images || []
                        });
                        setShowForm(true);
                        setEditingIndex(idx);
                      }}>Rediger</button>
                    </div>
                  </div>

                  {record.notes && <div className="history-notes">{record.notes}</div>}
                  {record.images && record.images.length > 0 && (
                    <div className="history-images">
                      {record.images.map((img, imgIdx) => (
                        <img key={imgIdx} src={img.data} alt={`Service ${idx}`} />
                      ))}
                    </div>
                  )}
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
                <label htmlFor="service-notes">Notater:</label>
                <textarea
                  id="service-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Detaljer, deler brukt, kostnader..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="service-cost">Kostnad (kr):</label>
                <input
                  id="service-cost"
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="service-images">📷 Bilder av jobben:</label>
                <div className="file-input-wrapper">
                  <input
                    id="service-images"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                    multiple
                  />
                  <div className="file-input-label">
                    <span className="file-input-icon">📷</span>
                    <span className="file-input-text">Klikk for å legge til bilder</span>
                  </div>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="image-preview-list">
                  <p className="preview-label">📷 {formData.images.length} bilde(r) valgt:</p>
                  <div className="image-grid">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="image-preview-item">
                        <img src={img.data} alt="Preview" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceHistoryModal;

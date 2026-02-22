import React, { useState } from 'react';
import './EditItemModal.css';

function EditItemModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    part: item.part || '',
    intervalKm: item.intervalKm || '',
    intervalYears: item.intervalYears || '',
    comments: item.comments || '',
    notes: item.notes || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...item, ...formData });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rediger vedlikehold</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSave} className="edit-form">
            <div className="form-section">
              <h3>📋 Vedlikehold</h3>
              <p className="item-category-badge">{item.category}</p>
            </div>

            <div className="form-group">
              <label htmlFor="part">Navn på vedlikehold:</label>
              <input
                id="part"
                type="text"
                name="part"
                value={formData.part}
                onChange={handleInputChange}
                placeholder="eks: Oljeskift motor"
              />
            </div>

            <div className="form-group">
              <label htmlFor="intervalKm">Intervall (km):</label>
              <input
                id="intervalKm"
                type="number"
                name="intervalKm"
                value={formData.intervalKm}
                onChange={handleInputChange}
                placeholder="eks: 15000"
                step="500"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="intervalYears">Intervall (år):</label>
              <input
                id="intervalYears"
                type="number"
                name="intervalYears"
                value={formData.intervalYears}
                onChange={handleInputChange}
                placeholder="eks: 1"
                step="0.5"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="comments">Kommentarer:</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="Notater og kommentarer om dette vedlikeholdet..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Tilleggsnoter:</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Andre relevante notat..."
                rows="2"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">Lagre endringer</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Avbryt</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditItemModal;

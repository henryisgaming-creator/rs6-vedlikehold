import React, { useState } from 'react';
import './AddServiceForm.css';

function AddServiceForm({ onAddService, onClose }) {
  const [formData, setFormData] = useState({
    part: '',
    interval: '',
    intervalKm: '',
    intervalYears: '',
    lastChanged: new Date().toISOString().split('T')[0],
    kmAtLastChange: '',
    notes: '',
    customPart: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.part.trim() || !formData.kmAtLastChange) return;

    const interval = formData.customPart 
      ? `${formData.intervalKm || '?'} km / ${formData.intervalYears || '?'} år`
      : formData.interval;

    onAddService({
      category: formData.category || 'Egendefinert',
      part: formData.part,
      interval,
      intervalKm: formData.intervalKm ? parseInt(formData.intervalKm) : null,
      intervalYears: formData.intervalYears ? parseInt(formData.intervalYears) : null,
      lastChanged: formData.lastChanged,
      kmAtLastChange: formData.kmAtLastChange,
      notes: formData.notes,
      isCustom: true
    });

    setFormData({
      part: '',
      interval: '',
      intervalKm: '',
      intervalYears: '',
      lastChanged: new Date().toISOString().split('T')[0],
      kmAtLastChange: '',
      notes: '',
      customPart: false
    });
    onClose();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('no-NO');
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Legg til service / del</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="add-service-form">
          <div className="form-group">
            <label htmlFor="part">Del / Service navn:</label>
            <input
              id="part"
              type="text"
              name="part"
              value={formData.part}
              onChange={handleChange}
              placeholder="f.eks. Spark plugs, Oil change, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori:</label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              placeholder="f.eks. Motor, Elektrisk, Egendefinert"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="customPart"
                checked={formData.customPart}
                onChange={handleChange}
              />
              Egendefinert serviceintervall
            </label>
          </div>

          {formData.customPart && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="intervalKm">Intervall (km):</label>
                  <input
                    id="intervalKm"
                    type="number"
                    name="intervalKm"
                    value={formData.intervalKm}
                    onChange={handleChange}
                    placeholder="f.eks. 50000"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="intervalYears">Intervall (år):</label>
                  <input
                    id="intervalYears"
                    type="number"
                    name="intervalYears"
                    value={formData.intervalYears}
                    onChange={handleChange}
                    placeholder="f.eks. 2"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastChanged">Dato for sist service:</label>
              <input
                id="lastChanged"
                type="date"
                name="lastChanged"
                value={formData.lastChanged}
                onChange={handleChange}
              />
              <small>{formatDate(formData.lastChanged)}</small>
            </div>
            <div className="form-group">
              <label htmlFor="kmAtLastChange">Km ved service:</label>
              <input
                id="kmAtLastChange"
                type="number"
                name="kmAtLastChange"
                value={formData.kmAtLastChange}
                onChange={handleChange}
                placeholder="Km-stand"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notater / Detaljer:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Del merke, modell, kostnader, etc."
              rows="3"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">Lagre Service</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Avbryt</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddServiceForm;

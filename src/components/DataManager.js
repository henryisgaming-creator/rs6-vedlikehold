import React from 'react';
import './DataManager.css';

function DataManager({ serviceHistory, customServices, currentKm }) {
  const handleExportData = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      serviceHistory,
      customServices,
      currentKm
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rs6-vedlikehold-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.serviceHistory && importedData.customServices) {
          localStorage.setItem('serviceHistory', JSON.stringify(importedData.serviceHistory));
          localStorage.setItem('customServices', JSON.stringify(importedData.customServices));
          localStorage.setItem('currentKm', importedData.currentKm || '');
          alert('✅ Data importert! Siden oppdateres nå.');
          window.location.reload();
        } else {
          alert('❌ Ugyldig backup-fil. Sjekk filen og prøv igjen.');
        }
      } catch (error) {
        alert('❌ Feil ved lesing av fil: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="data-manager">
      <div className="data-manager-card">
        <h3>📊 Databehandling</h3>
        <p className="data-manager-description">
          Sikkerhetskopier eller gjenopprett dine vedlikeholdsdata
        </p>

        <div className="data-manager-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleExportData}
            title="Last ned sikkerhetskopi av all data"
          >
            📥 Eksporter data
          </button>

          <label className="btn btn-secondary file-input-btn">
            📤 Importer data
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className="data-manager-info">
          <small>
            💡 Tips: Eksporter data regelmessig for å sikre at dine vedlikeholdshistorikk ikke går tapt.
          </small>
        </div>
      </div>
    </div>
  );
}

export default DataManager;

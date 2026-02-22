import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import MaintenanceList from './components/MaintenanceList';
import FilterBar from './components/FilterBar';
import MaintenanceDetails from './components/MaintenanceDetails';
import ServiceHistoryModal from './components/ServiceHistoryModal';
import maintenanceData from './data/maintenance.json';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentKm, setCurrentKm] = useState('');
  const [serviceHistory, setServiceHistory] = useState({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('serviceHistory');
    const savedKm = localStorage.getItem('currentKm');
    
    if (saved) setServiceHistory(JSON.parse(saved));
    if (savedKm) setCurrentKm(savedKm);
  }, []);

  // Save to localStorage when changes
  useEffect(() => {
    localStorage.setItem('serviceHistory', JSON.stringify(serviceHistory));
  }, [serviceHistory]);

  useEffect(() => {
    localStorage.setItem('currentKm', currentKm);
  }, [currentKm]);

  // Apply dark mode to body on mount
  useEffect(() => {
    document.body.className = 'dark-mode';
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(maintenanceData.map(item => item.category))];

  // Get unique statuses
  const statuses = ['All', ...new Set(maintenanceData.map(item => item.status))];

  // Filter data based on selected category and status
  const filteredData = useMemo(() => {
    return maintenanceData.filter(item => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const statusMatch = selectedStatus === 'All' || item.status === selectedStatus;
      return categoryMatch && statusMatch;
    });
  }, [selectedCategory, selectedStatus]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const handleAddServiceRecord = (item, date, km, notes) => {
    const key = `${item.category}|${item.part}`;
    const existing = serviceHistory[key] || [];
    setServiceHistory({
      ...serviceHistory,
      [key]: [...existing, { date, km, notes }]
    });
  };

  const handleOpenHistory = (item) => {
    setSelectedItemForHistory(item);
    setShowHistoryModal(true);
  };

  const handleCloseHistory = () => {
    setShowHistoryModal(false);
    setSelectedItemForHistory(null);
  };

  return (
    <div className="app dark-mode">
      <header className="app-header">
        <div className="header-top">
          <h1>RS6 Vedlikehold</h1>
        </div>
        <div className="km-input">
          <label htmlFor="current-km">Aktuell km:</label>
          <input
            id="current-km"
            type="number"
            value={currentKm}
            onChange={(e) => setCurrentKm(e.target.value)}
            placeholder="Skriv inn km-stand"
          />
        </div>
      </header>

      <FilterBar 
        categories={categories}
        statuses={statuses}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
      />

      <main className="app-main">
        {selectedItem ? (
          <MaintenanceDetails 
            item={selectedItem}
            currentKm={currentKm}
            onClose={handleCloseDetails}
            onAddServiceRecord={handleAddServiceRecord}
            onOpenHistory={handleOpenHistory}
            serviceHistory={serviceHistory}
          />
        ) : (
          <MaintenanceList 
            items={filteredData}
            onSelectItem={handleSelectItem}
            currentKm={currentKm}
          />
        )}
      </main>

      {showHistoryModal && selectedItemForHistory && (
        <ServiceHistoryModal
          item={selectedItemForHistory}
          history={serviceHistory}
          onClose={handleCloseHistory}
          onAddRecord={handleAddServiceRecord}
        />
      )}
    </div>
  );
}

export default App;

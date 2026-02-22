import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import MaintenanceList from './components/MaintenanceList';
import FilterBar from './components/FilterBar';
import MaintenanceDetails from './components/MaintenanceDetails';
import ServiceHistoryModal from './components/ServiceHistoryModal';
import AddServiceForm from './components/AddServiceForm';
import CostSummary from './components/CostSummary';
import QuickStats from './components/QuickStats';
import DataManager from './components/DataManager';
import maintenanceData from './data/maintenance.json';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentKm, setCurrentKm] = useState('');
  const [serviceHistory, setServiceHistory] = useState({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [customServices, setCustomServices] = useState([]);
  const [activeTab, setActiveTab] = useState('maintenance');
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('serviceHistory');
    const savedKm = localStorage.getItem('currentKm');
    const savedCustom = localStorage.getItem('customServices');
    
    if (saved) setServiceHistory(JSON.parse(saved));
    if (savedKm) setCurrentKm(savedKm);
    if (savedCustom) setCustomServices(JSON.parse(savedCustom));
  }, []);

  // Save to localStorage when changes
  useEffect(() => {
    localStorage.setItem('serviceHistory', JSON.stringify(serviceHistory));
  }, [serviceHistory]);

  useEffect(() => {
    localStorage.setItem('currentKm', currentKm);
  }, [currentKm]);

  // Save custom services to localStorage
  useEffect(() => {
    localStorage.setItem('customServices', JSON.stringify(customServices));
  }, [customServices]);

  // Apply dark mode to body on mount
  useEffect(() => {
    document.body.className = 'dark-mode';
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(maintenanceData.map(item => item.category))];

  // Get unique statuses
  const statuses = ['All', ...new Set(maintenanceData.map(item => item.status))];

  // Filter data based on selected category, status, and search term
  const filteredData = useMemo(() => {
    return maintenanceData.filter(item => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const statusMatch = selectedStatus === 'All' || item.status === selectedStatus;
      const searchMatch = searchTerm === '' || 
        item.part.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    });
  }, [selectedCategory, selectedStatus, searchTerm]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const handleAddServiceRecord = (item, date, km, notes, images = [], cost = 0) => {
    const key = `${item.category || 'custom'}|${item.part}`;
    const existing = serviceHistory[key] || [];
    setServiceHistory({
      ...serviceHistory,
      [key]: [...existing, { date, km, notes, images, cost }]
    });
  };

  const handleAddCustomService = (service) => {
    // service should have: part, interval, intervalKm, intervalYears, lastChanged, kmAtLastChange, notes, images
    setCustomServices([...customServices, { ...service, id: Date.now() }]);
    setShowAddServiceForm(false);
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
          <button 
            className="btn-add-service"
            onClick={() => setShowNewItemModal(true)}
            title="Legg til nytt vedlikehold"
          >
            + Nytt
          </button>
        </div>
        
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            🔧 Vedlikehold
          </button>
          <button
            className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            💰 Kostnader
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Innstillinger
          </button>
        </div>

        {activeTab === 'maintenance' && (
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
        )}
      </header>

      {activeTab === 'maintenance' && (
        <>
          <FilterBar 
            categories={categories}
            statuses={statuses}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            searchTerm={searchTerm}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onSearchChange={setSearchTerm}
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
              <>
                <QuickStats 
                  items={filteredData}
                  currentKm={currentKm}
                  serviceHistory={serviceHistory}
                />
                <MaintenanceList 
                  items={filteredData}
                  onSelectItem={handleSelectItem}
                  currentKm={currentKm}
                  serviceHistory={serviceHistory}
                />
              </>
            )}
          </main>
        </>
      )}

      {activeTab === 'expenses' && (
        <main className="app-main expenses-view">
          <CostSummary serviceHistory={serviceHistory} />
        </main>
      )}

      {activeTab === 'settings' && (
        <main className="app-main settings-view">
          <DataManager 
            serviceHistory={serviceHistory} 
            customServices={customServices}
            currentKm={currentKm}
          />
        </main>
      )}

      {showHistoryModal && selectedItemForHistory && (
        <ServiceHistoryModal
          item={selectedItemForHistory}
          history={serviceHistory}
          onClose={handleCloseHistory}
          onAddRecord={handleAddServiceRecord}
        />
      )}

      {showAddServiceForm && (
        <AddServiceForm
          onAddService={handleAddCustomService}
          onClose={() => setShowAddServiceForm(false)}
        />
      )}

      {showNewItemModal && (
        <AddServiceForm
          onAddService={handleAddCustomService}
          onClose={() => setShowNewItemModal(false)}
          title="Legg til nytt vedlikehold"
        />
      )}
    </div>
  );
}

export default App;

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  const [itemOverrides, setItemOverrides] = useState({});
  const [activeTab, setActiveTab] = useState('maintenance');
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('serviceHistory');
    const savedKm = localStorage.getItem('currentKm');
    const savedCustom = localStorage.getItem('customServices');
    const savedOverrides = localStorage.getItem('itemOverrides');
    
    if (saved) setServiceHistory(JSON.parse(saved));
    // restore last entered km (keep as string so input updates cleanly)
    if (savedKm !== null && savedKm !== undefined) setCurrentKm(savedKm);
    if (savedCustom) setCustomServices(JSON.parse(savedCustom));
    if (savedOverrides) setItemOverrides(JSON.parse(savedOverrides));
  }, []);

  // Ref for km input so we can autofocus/select last entered value
  const kmInputRef = useRef(null);

  // Focus and select KM input when maintenance tab becomes active
  useEffect(() => {
    if (activeTab === 'maintenance' && kmInputRef.current) {
      try {
        kmInputRef.current.focus();
        kmInputRef.current.select();
      } catch (e) {
        // ignore
      }
    }
  }, [activeTab]);

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

  useEffect(() => {
    localStorage.setItem('itemOverrides', JSON.stringify(itemOverrides));
  }, [itemOverrides]);

  // Apply dark mode to body on mount
  useEffect(() => {
    document.body.className = 'dark-mode';
  }, []);

  // Get unique categories
  // Build display list combining built-in maintenance and custom services
  const combinedList = [...maintenanceData, ...customServices].map(it => {
    const key = `${it.category || 'custom'}|${it.part}`;
    if (itemOverrides && itemOverrides[key]) {
      return { ...it, ...itemOverrides[key] };
    }
    return it;
  });

  // Get unique categories and statuses
  const categories = ['All', ...new Set(combinedList.map(item => item.category))];
  const statuses = ['All', ...new Set(combinedList.map(item => item.status || ''))];

  // Filter data based on selected category, status, and search term
  const filteredData = useMemo(() => {
    return combinedList.filter(item => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const statusMatch = selectedStatus === 'All' || (item.status || '') === selectedStatus;
      const searchMatch = searchTerm === '' || 
        (item.part || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    });
  }, [combinedList, selectedCategory, selectedStatus, searchTerm]);

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

  const handleDeleteServiceRecord = (key, index) => {
    const existing = serviceHistory[key] || [];
    const updated = existing.filter((_, i) => i !== index);
    const copy = { ...serviceHistory };
    if (updated.length > 0) copy[key] = updated; else delete copy[key];
    setServiceHistory(copy);
  };

  const handleUpdateServiceRecord = (key, index, payload) => {
    const existing = serviceHistory[key] || [];
    if (!existing[index]) return;
    const updated = existing.slice();
    updated[index] = payload;
    setServiceHistory({ ...serviceHistory, [key]: updated });
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

  const handleSaveItemOverride = (updatedItem) => {
    const key = `${updatedItem.category || 'custom'}|${updatedItem.part}`;
    setItemOverrides(prev => ({ ...prev, [key]: { ...(prev[key] || {}), ...updatedItem } }));
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
              ref={kmInputRef}
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
                onSaveEdits={handleSaveItemOverride}
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
          onDeleteRecord={handleDeleteServiceRecord}
          onUpdateRecord={handleUpdateServiceRecord}
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

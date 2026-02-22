import React from 'react';
import './CostSummary.css';

function CostSummary({ serviceHistory }) {
  const allRecords = Object.entries(serviceHistory).flatMap(([key, records]) => {
    const [category, part] = key.split('|');
    return records.map(record => ({
      category,
      part,
      ...record,
      cost: record.cost || 0
    }));
  });

  const totalCost = allRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
  
  const costByCategory = {};
  allRecords.forEach(record => {
    if (!costByCategory[record.category]) {
      costByCategory[record.category] = 0;
    }
    costByCategory[record.category] += record.cost || 0;
  });

  const sortedCategories = Object.entries(costByCategory)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="cost-summary">
      <div className="cost-summary-header">
        <h3>💰 Utgiftsoversikt</h3>
      </div>
      
      <div className="cost-card total-card">
        <div className="cost-label">Totale utgifter</div>
        <div className="cost-amount">{totalCost.toLocaleString('no-NO')} kr</div>
        <div className="cost-detail">{allRecords.length} tjenester registrert</div>
      </div>

      {sortedCategories.length > 0 && (
        <div className="cost-breakdown">
          <h4>Utgifter per kategori</h4>
          <div className="category-costs">
            {sortedCategories.map(([category, amount]) => (
              <div key={category} className="category-cost-item">
                <div className="category-cost-label">{category}</div>
                <div className="category-cost-bar">
                  <div 
                    className="category-cost-fill"
                    style={{ 
                      width: `${(amount / (sortedCategories[0][1] || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="category-cost-amount">{amount.toLocaleString('no-NO')} kr</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allRecords.length === 0 && (
        <div className="no-costs">
          <p>Ingen kostnader registrert ennå</p>
        </div>
      )}
    </div>
  );
}

export default CostSummary;

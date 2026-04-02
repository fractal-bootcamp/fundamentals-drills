import { useState } from 'react';

type InventoryItem = {
  name: string;
  category: 'plant' | 'herb' | 'tree';
  stock: number;
};

const inventory: InventoryItem[] = [
  { name: 'Lavender', category: 'herb', stock: 4 },
  { name: 'Mint', category: 'herb', stock: 0 },
  { name: 'Chive', category: 'herb', stock: 7 },
  { name: 'Fern', category: 'plant', stock: 2 },
  { name: 'Succulent', category: 'plant', stock: 1 },
  { name: 'Peace Lily', category: 'plant', stock: 0 },
  { name: 'Maple', category: 'tree', stock: 5 },
  { name: 'Birch', category: 'tree', stock: 3 },
  { name: 'Pine', category: 'tree', stock: 1 },
];

export default function RefactorMe() {
  const [plantFilter, setPlantFilter] = useState('');
  const [herbFilter, setHerbFilter] = useState('');
  const [treeFilter, setTreeFilter] = useState('');
  const [highlighted, setHighlighted] = useState('');

  const plantMatches = inventory.filter(
    (item) =>
      item.category === 'plant' && item.name.toLowerCase().includes(plantFilter.toLowerCase()),
  );
  const herbMatches = inventory.filter(
    (item) =>
      item.category === 'herb' && item.name.toLowerCase().includes(herbFilter.toLowerCase()),
  );
  const treeMatches = inventory.filter(
    (item) =>
      item.category === 'tree' && item.name.toLowerCase().includes(treeFilter.toLowerCase()),
  );

  const plantTitle =
    highlighted.length > 0 && highlighted === 'Plants' ? 'Plants (selected)' : 'Plants';
  const herbTitle =
    highlighted.length > 0 && highlighted === 'Herbs' ? 'Herbs (selected)' : 'Herbs';
  const treeTitle =
    highlighted.length > 0 && highlighted === 'Trees' ? 'Trees (selected)' : 'Trees';

  return (
    <div>
      <section>
        <h2>{plantTitle}</h2>
        <label>
          Filter plants
          <input value={plantFilter} onChange={(event) => setPlantFilter(event.target.value)} />
        </label>
        <button onClick={() => setHighlighted('Plants')}>Highlight</button>
        <ul>
          {plantMatches.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span>
                {item.stock === 0
                  ? 'Sold out'
                  : item.stock === 1
                    ? 'Only 1 left'
                    : `${item.stock} available`}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{herbTitle}</h2>
        <label>
          Filter herbs
          <input value={herbFilter} onChange={(event) => setHerbFilter(event.target.value)} />
        </label>
        <button onClick={() => setHighlighted('Herbs')}>Highlight</button>
        <ul>
          {herbMatches.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span>
                {item.stock === 0
                  ? 'Sold out'
                  : item.stock === 1
                    ? 'Only 1 left'
                    : `${item.stock} available`}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{treeTitle}</h2>
        <label>
          Filter trees
          <input value={treeFilter} onChange={(event) => setTreeFilter(event.target.value)} />
        </label>
        <button onClick={() => setHighlighted('Trees')}>Highlight</button>
        <ul>
          {treeMatches.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span>
                {item.stock === 0
                  ? 'Sold out'
                  : item.stock === 1
                    ? 'Only 1 left'
                    : `${item.stock} available`}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import { Kingdom } from '@dungeon-maister/data-models';

interface SelectKingdomProps {
  kingdoms: Kingdom[];
  onSelect: (kingdomId: string) => void;
}

const buttonStyle = {
  padding: '16px',
  minWidth: '180px',
  textAlign: 'left' as const,
  backgroundColor: '#333',
  border: '1px solid #555',
  color: 'white',
  cursor: 'pointer',
};

const h3Style = {
  marginTop: 0,
  marginBottom: '8px',
};

export function SelectKingdom({ kingdoms, onSelect }: SelectKingdomProps) {
  return (
    <div>
      <h2>Choose Your Kingdom</h2>
      <p>Your Kingdom establishes a thematic and minor statistical leaning.</p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
        {kingdoms.map((kingdom) => (
          <button key={kingdom.id} onClick={() => onSelect(kingdom.id)} style={buttonStyle}>
            <h3 style={h3Style}>{kingdom.name}</h3>
            <p style={{margin: 0}}>{kingdom.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

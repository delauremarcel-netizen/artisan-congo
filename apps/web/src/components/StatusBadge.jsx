import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();
  
  let type = 'yellow';
  let label = status;

  if (['terminé', 'completed', 'résolu', 'fermé', 'payé'].includes(normalized)) {
    type = 'green';
  } else if (['litige', 'annulé', 'rejeté', 'failed'].includes(normalized)) {
    type = 'red';
  }

  return (
    <span className={`status-badge-${type}`}>
      {label || 'En attente'}
    </span>
  );
}
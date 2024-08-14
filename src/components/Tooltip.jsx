import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '6px',
            backgroundColor: '#333',
            color: '#fff',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            zIndex: '1000',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};



export default Tooltip;

import React, { createContext, useContext, useState } from 'react';

const backgroundStyles = {
  checkerboard: {
    backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  },
  white: {
    backgroundColor: '#ffffff'
  },
  black: {
    backgroundColor: '#000000'
  },
  gray: {
    backgroundColor: '#808080'
  }
};

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [backgroundStyle, setBackgroundStyle] = useState('checkerboard');

  const value = {
    backgroundStyle,
    setBackgroundStyle,
    backgroundStyles,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}; 
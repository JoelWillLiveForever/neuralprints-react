import { createContext, useContext, useState, ReactNode } from 'react';

// Создаем контекст
const DnDContext = createContext<[string | null, (type: string | null) => void] | undefined>(undefined);

// Создаем провайдер контекста
export const DnDProvider = ({ children }: {children: ReactNode}) => {
  const [type, setType] = useState<string | null>(null);
 
  return (
    <DnDContext.Provider value={[type, setType]}>
        {children}
    </DnDContext.Provider>
  );
}

// export default DnDContext;

// Создаем хук для использования контекста
export const useDnD = () => {
    const context = useContext(DnDContext);
    if (!context) {
        throw new Error('useDnD must be used within a DnDProvider');
    }
    return context;
}
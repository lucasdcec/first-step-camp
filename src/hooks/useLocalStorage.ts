'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isMounted, setIsMounted] = useState(false)

  // Ler do localStorage na primeira renderização
  useEffect(() => {
    // Só executa no cliente
    if (typeof window === 'undefined') return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Erro ao ler localStorage (${key}):`, error)
    }
    setIsMounted(true)
  }, [key])

  // Função para atualizar valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      // Salvar no localStorage apenas se montado
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Erro ao salvar localStorage (${key}):`, error)
    }
  }

  return [storedValue, setValue]
}

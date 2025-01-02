import { formatAlias } from '@/utils/utils';
import { useState, useEffect } from 'react';

export const useAlias = (initialAlias: string = '') => {
  const [alias, setAlias] = useState(initialAlias);
  const [aliasError, setAliasError] = useState('');

  const checkAlias = (value: string) => {
    if (!value) {
      setAliasError('');
      return true;
    }
    if (value.length < 4) {
      setAliasError('Alias must be at least 4 characters');
      return false;
    }
    if (value.length > 50) {
      setAliasError('Alias must be less than 50 characters');
      return false;
    }
    if (!/^[a-z0-9-_]+$/i.test(value)) {
      setAliasError('Alias can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    setAliasError('');
    return true;
  };

  useEffect(() => {
    checkAlias(alias);
    const timeout = setTimeout(() => {
      setAlias(formatAlias(alias));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [alias]);

  return { alias, setAlias, aliasError };
};
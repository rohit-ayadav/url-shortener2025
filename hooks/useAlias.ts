import { formatAlias } from '@/utils/utils';
import { useState, useEffect } from 'react';

export const useAlias = (initialAlias: string = '') => {
  const [alias, setAlias] = useState(initialAlias);
  const [aliasError, setAliasError] = useState('');
  const [prefix, setPrefix] = useState('');


  const checkAlias = (value: string) => {
    if (!value) {
      setAliasError('');
      return true;
    }
    // if (value.length < 4) {
    //   setAliasError('Alias or Prefix must be at least 4 characters');
    //   return false;
    // }
    if (value.length > 50) {
      setAliasError('Alias or Prefix must be less than 50 characters');
      return false;
    }
    if (!/^[a-z0-9-_]+$/i.test(value)) {
      setAliasError('Alias or Prefix can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    setAliasError('');
    return true;
  };

  useEffect(() => {
    checkAlias(alias);
    checkAlias(prefix);
    const timeout = setTimeout(() => {
      setAlias(formatAlias(alias));
      setPrefix(formatAlias(prefix));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [alias, prefix]);

  return { alias, setAlias, aliasError, prefix, setPrefix };
};
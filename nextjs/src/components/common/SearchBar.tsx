import { useState } from 'react';
import type { FormEvent } from 'react';
import { IconButton } from './IconButton';

interface SearchBarProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ onSubmit, placeholder = '검색어를 입력해주세요.', className = '' }: SearchBarProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleIconClick = () => {
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`form-container ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <IconButton src="/images/search.png" width={16} height={16} onClick={handleIconClick} type="button" />
    </form>
  );
};

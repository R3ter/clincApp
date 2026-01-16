import React, { useState, useRef, useEffect } from 'react';
import './EditableSelect.css';

const EditableSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select or type...',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const filter = inputValue.toLowerCase();
    if (filter) {
      setFilteredOptions(
        options.filter(opt => opt.toLowerCase().includes(filter))
      );
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={`editable-select-wrapper ${className}`} ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="editable-select-input"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="editable-select-dropdown">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="editable-select-option"
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditableSelect;

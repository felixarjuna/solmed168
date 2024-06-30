import React, { useState, type ChangeEvent } from "react";

interface RupiahInputProps {
  readonly onChange: (value: number) => void;
}

const RupiahInput: React.FC<RupiahInputProps> = ({ onChange }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [formattedValue, setFormattedValue] = useState<string>("");

  const formatRupiah = (value: string): string => {
    const number = parseInt(value.replace(/\D/g, ""), 10);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setInputValue(value);
    setFormattedValue(formatRupiah(value));
    onChange(parseInt(value, 10) || 0);
  };

  return (
    <div>
      <input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter amount"
      />
      <div>{formattedValue}</div>
    </div>
  );
};

export default RupiahInput;

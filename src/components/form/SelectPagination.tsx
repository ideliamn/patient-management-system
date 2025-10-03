import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectPaginationProps {
  placeholder?: string;
  onChange: (value: number) => void;
  className?: string;
  // defaultValue?: string;
  value?: number;
}

const optionsPagination = [
  {
    value: 10,
    label: "10 data per halaman"
  },
  {
    value: 20,
    label: "20 data per halaman"
  },
  {
    value: 50,
    label: "50 data per halaman"
  },
  {
    value: 100,
    label: "100 data per halaman"
  },
]

const SelectPagination: React.FC<SelectPaginationProps> = ({
  placeholder = "Ubah jumlah data per halaman...",
  onChange,
  className = "",
  // defaultValue = "",
  value = 10,
}) => {
  // Manage the selected value
  // const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    // setSelectedValue(value);
    onChange(value); // Trigger parent handler
    // onChange(e.target.value);
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${value
        ? "text-gray-800 dark:text-white/90"
        : "text-gray-400 dark:text-gray-400"
        } ${className}`}
      value={value}
      onChange={handleChange}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {optionsPagination.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectPagination;
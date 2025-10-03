import Select from "react-select";

export type SelectOption = {
    value: string;
    label: string;
};

interface Props {
    className?: string;
    placeholder: string;
    options: SelectOption[];
    value?: SelectOption | null;
    onChange: (value: SelectOption | null) => void;
}

export default function SearchableSelect({
    className,
    options,
    value,
    onChange,
    placeholder,
}: Props) {
    return (
        <Select
            className={className}
            options={options}
            value={value ?? null}
            onChange={(selected) => onChange(selected as SelectOption | null)}
            placeholder={placeholder}
            isClearable
            isSearchable
        // className={className}
        // styles={{
        //     control: (base) => ({
        //         ...base,
        //         backgroundColor: "var(--tw-bg-dark-900)",
        //         borderRadius: "0.5rem",
        //         minHeight: "44px",
        //     }),
        //     menu: (base) => ({
        //         ...base,
        //         backgroundColor: "#111827",
        //         color: "white",
        //     }),
        //     option: (base, state) => ({
        //         ...base,
        //         backgroundColor: state.isSelected
        //             ? "#2563eb"
        //             : state.isFocused
        //                 ? "#1f2937"
        //                 : "#111827",
        //         color: "white",
        //     }),
        // }}
        />
    );
}

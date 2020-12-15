import { Input, InputNumber, Select } from 'antd';
import React, { useState } from 'react';

export interface NumberWithUnitValue<T = any> {
  number?: number;
  unit?: T;
}

export interface NumberWithUnitInputProps<T = any> {
  value?: NumberWithUnitValue;
  onChange?: (value: NumberWithUnitValue) => void;
  options: { label: string; unit: T }[];
  defaultUnit?: number | string;
}

/**
 * 自定义表单控件 带单位表的数值
 */
const NumberWithUnit: React.FC<NumberWithUnitInputProps> = ({
  value = {},
  onChange,
  options,
  defaultUnit,
}) => {
  const [number, setNumber] = useState(value.number);
  const [unit, setUnit] = useState(value.unit || defaultUnit);
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({ number, unit, ...value, ...changedValue });
    }
  };
  const onNumberChange = (newNumber: number) => {
    if (Number.isNaN(number)) {
      return;
    }

    if (!('number' in value)) {
      setNumber(newNumber);
    }

    triggerChange({ number: newNumber });
  };
  const onUnitChange = (newUnit) => {
    if (!('unit' in value)) {
      setUnit(newUnit);
    }

    triggerChange({ unit: newUnit });
  };

  return (
    <Input.Group compact style={{ display: 'flex' }}>
      <InputNumber value={value.number || number} onChange={onNumberChange} style={{ flex: 1 }} />
      <Select value={value.unit || unit} onChange={onUnitChange}>
        {options.map(({ label, unit }) => (
          <Select.Option value={unit} key={unit}>
            {label}
          </Select.Option>
        ))}
      </Select>
    </Input.Group>
  );
};

export default  NumberWithUnit;
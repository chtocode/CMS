import { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import { Omit } from 'antd/es/_util/type';
import * as React from 'react';
import DatePicker from './date-picker';

export interface TimePickerProps extends Omit<PickerTimeProps<Date>, 'picker'> {}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return <DatePicker {...props} picker="time" mode={undefined} ref={ref} />;
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;

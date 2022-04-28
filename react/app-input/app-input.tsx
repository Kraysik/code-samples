import { TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { Control, Controller, Path, RegisterOptions } from 'react-hook-form';

type AppInputPropsType<TFormValues> = {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  rules?: RegisterOptions;
  label: string;
  textFieldProps?: TextFieldProps;
};
export default function AppInput<TFormValues>({
  name,
  control,
  rules,
  label,
  textFieldProps,
}: AppInputPropsType<TFormValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...textFieldProps}
          label={label}
          helperText={fieldState.error?.message}
          error={fieldState.invalid}
        />
      )}
    />
  );
}

import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { Control, Controller, Path, RegisterOptions } from 'react-hook-form';

type SelectWithSearchProps<TFormValues, TSelectOption> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  labelText: string;
  selectId: string;
  optionsList: TSelectOption[];
  rules?: RegisterOptions;
};

export default function SelectWithSearch<TFormValues, TSelectOption extends { _id: string; name: string }>({
  control,
  selectId,
  labelText,
  name,
  optionsList,
  rules,
}: SelectWithSearchProps<TFormValues, TSelectOption>) {
  const [optionSortQuery, setOptionSortQuery] = useState<string>('');

  /**
   * Получаем список отсортированных опшинов (имитируем поиск)
   * */
  const getSortedOptions = () => {
    if (!optionsList.length) return [];
    console.log({ optionsList });

    return [...optionsList].filter((option) => option.name.toLowerCase().includes(optionSortQuery));
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <FormControl sx={{ width: '100%' }} error={fieldState.invalid}>
            <InputLabel id={`${selectId}-label`}>{labelText}</InputLabel>
            <Select
              {...field}
              labelId={`${selectId}-label`}
              id={selectId}
              label={labelText}
              onChange={(event) => {
                setOptionSortQuery('');
                field.onChange(event);
              }}
            >
              {optionsList.length ? (
                <MenuItem>
                  <TextField
                    name="search"
                    size="small"
                    variant="standard"
                    placeholder="Поиск..."
                    autoComplete="off"
                    onKeyDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                      setOptionSortQuery(event.target.value.toLowerCase());
                    }}
                  />
                </MenuItem>
              ) : (
                <Stack p={3} alignItems="center">
                  <CircularProgress color="secondary" />
                </Stack>
              )}
              {getSortedOptions().map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{fieldState.invalid && fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}

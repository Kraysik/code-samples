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
import { Control, Controller, Path } from 'react-hook-form';

import { CommonSelectOptionType } from '../../../helpers/commonTypes';
import { InvoiceFormProps } from '../../../pages/invoice/create';

type SelectWithSearchProps = {
  control: Control<InvoiceFormProps>;
  name: Path<InvoiceFormProps>;
  labelText: string;
  isError: boolean;
  errorMessage: string | undefined;
  selectId: string;
  fetchOptions: () => Promise<CommonSelectOptionType[]>;
  rules?: { required: string | boolean };
};

export default function SelectWithSearch({
  control,
  selectId,
  errorMessage,
  isError,
  labelText,
  name,
  fetchOptions,
  rules,
}: SelectWithSearchProps) {
  const [options, setOptions] = useState<CommonSelectOptionType[]>([]);
  const [optionSortQuery, setOptionSortQuery] = useState<string>('');

  const getOptions = async () => {
    if (options.length) return;

    const optionsList = await fetchOptions();
    setOptions(optionsList);
  };

  /**
   * Получаем список отсортированных работников (имитируем поиск)
   * */
  const getSortedOptions = () => {
    if (!options.length) return [];

    return [...options].filter((option) => option.name.toLowerCase().includes(optionSortQuery));
  };

  return (
    <FormControl sx={{ width: '100%' }} error={isError}>
      <InputLabel id={`${selectId}-label`}>{labelText}</InputLabel>
      <Controller
        name={`${name}`}
        control={control}
        rules={rules}
        defaultValue=""
        render={({ field }) => (
          <Select
            {...field}
            labelId={`${selectId}-label`}
            id={selectId}
            label={labelText}
            onChange={(event) => {
              setOptionSortQuery('');
              field.onChange(event);
            }}
            onOpen={getOptions}
          >
            {options.length ? (
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
        )}
      />
      <FormHelperText>{errorMessage ? errorMessage : ''}</FormHelperText>
    </FormControl>
  );
}

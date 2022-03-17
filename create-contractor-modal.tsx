import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Modal, Stack, TextField, Typography } from '@mui/material';
import { useAtom } from '@reatom/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ContractorType } from '../../models/Contractor';
import { createNewContractor, fetchContractorContacts } from '../../repository/contractor';
import { isContractorContactModalOpenAtom } from '../../store/ui/contractorContactModalAtom';
import { isContractorModalOpenAtom } from '../../store/ui/contractorModalAtom';
import { isSnackbarOpenAtom, snackbarTextAtom } from '../../store/ui/snackbarAtom';
import ContractorContactSelect from '../ui/select-with-search/contractor-contact-select/contractor-contact-select';

import { StyledCloseBtn, StyledModal } from './styled';

export default function CreateContractorModal() {
  const [isOpen, { setFalse }] = useAtom(isContractorModalOpenAtom);
  const [isContactOpen, { setTrue: setOpenCreateContact }] = useAtom(isContractorContactModalOpenAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [isContractorCreated, { setTrue: setIsContractorCreated }] = useAtom(isSnackbarOpenAtom);
  const [snackbarText, { change: changeSnackbarText }] = useAtom(snackbarTextAtom);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<ContractorType>({ mode: 'onChange' });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await createNewContractor(data);

    reset();
    setLoading(false);
    changeSnackbarText('Контрагент добавлен успешно!');
    setIsContractorCreated();
    setFalse();
  });

  const handleClose = () => {
    reset();
    setFalse();
  };

  return (
    <Modal open={isOpen} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-body" onClose={handleClose}>
      <StyledModal component="form" onSubmit={onSubmit}>
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <StyledCloseBtn onClick={setFalse} size="large">
            <CloseIcon fontSize="large" />
          </StyledCloseBtn>
          <Typography variant="h3" id="modal-modal-title" mb={5}>
            Добавьте нового контрагента
          </Typography>
          <Stack spacing={2} id="modal-modal-body">
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'Данное поле обязательно для заполнения' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Компания*"
                  color="primary"
                  helperText={fieldState.error?.message}
                  error={fieldState.invalid}
                  inputProps={{ autoComplete: 'off' }}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Телефон"
                  color="primary"
                  helperText={fieldState.error?.message}
                  error={fieldState.invalid}
                  inputProps={{ autoComplete: 'off' }}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Email"
                  color="primary"
                  helperText={fieldState.error?.message}
                  error={fieldState.invalid}
                  inputProps={{ autoComplete: 'off' }}
                />
              )}
            />
            <Controller
              name="comment"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Комментарий"
                  color="primary"
                  multiline
                  rows={4}
                  helperText={fieldState.error?.message}
                  error={fieldState.invalid}
                  inputProps={{ autoComplete: 'off' }}
                />
              )}
            />
            <Grid container justifyContent="space-between">
              <Grid item xs={9}>
                <ContractorContactSelect
                  control={control}
                  name="contactPerson"
                  labelText="Контактное лицо"
                  isError={!!errors?.contactPerson}
                  errorMessage={errors?.contactPerson?.message}
                  selectId="contactPerson"
                  fetchOptions={fetchContractorContacts}
                />
              </Grid>
              <Grid item xs={2}>
                <Button fullWidth={true} size="large" sx={{ mt: 0.5 }} onClick={setOpenCreateContact}>
                  Добавить
                </Button>
              </Grid>
            </Grid>
          </Stack>
          <LoadingButton
            fullWidth={true}
            sx={{ mt: 4 }}
            type="submit"
            variant="contained"
            disabled={!isValid}
            loading={loading}
          >
            Добавить
          </LoadingButton>
        </Container>
      </StyledModal>
    </Modal>
  );
}

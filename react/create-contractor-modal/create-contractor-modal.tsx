import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Modal, Stack, Typography } from '@mui/material';
import { useAtom } from '@reatom/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ContractorType } from '../../models/Contractor';
import { ContractorContactType } from '../../models/ContractorContactPerson';
import { createNewContractor } from '../../repository/contractor';
import { invoiceSelectsOptionsAtom } from '../../store/invoice/selectsOptions';
import { isContractorContactModalOpenAtom } from '../../store/ui/contractorContactModalAtom';
import { isContractorModalOpenAtom } from '../../store/ui/contractorModalAtom';
import { isSnackbarOpenAtom, snackbarTextAtom } from '../../store/ui/snackbarAtom';
import AppInput from '../ui/app-input/app-input';
import SelectWithSearch from '../ui/select-with-search/select-with-search';

import { StyledCloseBtn, StyledModal } from './styled';

export default function CreateContractorModal() {
  const [{ contactPersonOptions }, {}] = useAtom(invoiceSelectsOptionsAtom);
  const [isOpen, { setFalse }] = useAtom(isContractorModalOpenAtom);
  const [isContactOpen, { setTrue: setOpenCreateContact }] = useAtom(isContractorContactModalOpenAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [isContractorCreated, { setTrue: setIsContractorCreated }] = useAtom(isSnackbarOpenAtom);
  const [snackbarText, { change: changeSnackbarText }] = useAtom(snackbarTextAtom);
  const [selectOptions, { addContractorOption }] = useAtom(invoiceSelectsOptionsAtom);
  const {
    handleSubmit,
    control,
    formState: { isValid },
    reset,
  } = useForm<ContractorType>({
    mode: 'onChange',
    defaultValues: { name: '', phone: '', email: '', comment: '', contactPerson: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const { data: newContractorData } = await createNewContractor(data);

    addContractorOption(newContractorData);
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
            <AppInput<ContractorType>
              name="name"
              control={control}
              label="Компания*"
              rules={{ required: 'Данное поле обязательно для заполнения' }}
            />
            <AppInput<ContractorType>
              name="phone"
              control={control}
              label="Телефон"
              inputProps={{ autoComplete: 'off' }}
            />
            <AppInput<ContractorType>
              name="email"
              control={control}
              label="Email"
              inputProps={{ autoComplete: 'off' }}
            />
            <AppInput<ContractorType>
              name="comment"
              control={control}
              label="Комментарий"
              inputProps={{ autoComplete: 'off' }}
              textFieldProps={{ multiline: true, rows: 4 }}
            />
            <Grid container justifyContent="space-between">
              <Grid item xs={9}>
                <SelectWithSearch<ContractorType, ContractorContactType>
                  control={control}
                  name="contactPerson"
                  labelText="Контактное лицо"
                  selectId="contactPerson"
                  optionsList={contactPersonOptions}
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

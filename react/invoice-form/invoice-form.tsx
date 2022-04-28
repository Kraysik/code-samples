import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { useAtom } from '@reatom/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { SingleInvoiceFromApiType } from '../../models/Invoice';
import { InvoiceFormProps } from '../../pages/invoice/create';
import { isInvoiceCreatingAtom } from '../../store/ui/createInvoiceAtom';
import { isSnackbarOpenAtom, snackbarTextAtom } from '../../store/ui/snackbarAtom';
import ContractorFormBlock from '../contractor-form-block/contractor-form-block';
import PaymentMethodFormBlock from '../payment-method-form-block/payment-method-form-block';
import ServicesFormBlock from '../services-form-block/services-form-block';

type CreateInvoiceFormPropsType = {
  defaultValues: InvoiceFormProps;
  submitFormAction: (
    data: InvoiceFormProps,
  ) => Promise<(InvoiceFormProps & { _id: string }) | SingleInvoiceFromApiType>;
};

export default function InvoiceForm({ defaultValues, submitFormAction }: CreateInvoiceFormPropsType) {
  const router = useRouter();
  const [isInvoiceCreating, { setFalse: setIsCreatingDone, setTrue: setIsCreatingStart }] =
    useAtom(isInvoiceCreatingAtom);
  const [isInvoiceCreated, { setTrue: setIsInvoiceCreated }] = useAtom(isSnackbarOpenAtom);
  const [snackbarText, { change: changeSnackbarText }] = useAtom(snackbarTextAtom);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<InvoiceFormProps>({
    mode: 'all',
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsCreatingStart();
    // вычисляем стоимость каждой услуги(сотрудника).
    data.services = data.services.map((service) => ({
      ...service,
      total: Number(service.rate) * Number(service.volume),
    }));
    // вычисляем общую стоимость услуг по счету.
    data.totalByServices = data.services.reduce(function (sum, current) {
      return sum + current.total;
    }, 0);

    const newInvoice = await submitFormAction(data);
    setIsCreatingDone();
    changeSnackbarText('Счет успешно сохранён!');
    setIsInvoiceCreated();

    await router.push(`/invoice/${newInvoice._id}`);
  });

  return (
    <Stack component="form" autoComplete="off" onSubmit={onSubmit} spacing={5} sx={{ mt: 7, mb: 6 }}>
      <ContractorFormBlock control={control} errors={errors} />
      <PaymentMethodFormBlock control={control} errors={errors} watch={watch} />
      <ServicesFormBlock control={control} errors={errors} watch={watch} />
      <LoadingButton type="submit" variant="contained" sx={{ mt: 3 }} disabled={!isValid} loading={isInvoiceCreating}>
        Сохранить
      </LoadingButton>
    </Stack>
  );
}

import { Box, IconButton, styled } from '@mui/material';

export const StyledModal = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: white;
  padding: ${({ theme }) => theme.spacing(4)};
  padding-top: ${({ theme }) => theme.spacing(6)};
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  outline: none;
`;
export const StyledCloseBtn = styled(IconButton)`
  position: absolute;
  right: -40px;
  top: 10px;
`;

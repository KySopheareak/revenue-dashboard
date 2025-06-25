import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';

export interface StatusChipProps {
  status: 'paid' | 'canceled' | 'unpaid';
}

const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <Chip
      variant="outlined"
      size="small"
      icon={
        <IconifyIcon
          icon="radix-icons:dot-filled"
          sx={(theme) => ({
            color:
              status === 'paid'
                ? `${theme.palette.success.main} !important`
                : status === 'unpaid'
                  ? `${theme.palette.warning.main} !important`
                  : `${theme.palette.error.main} !important`,
          })}
        />
      }
      label={status}
      sx={{
        pr: 0.65,
        width: 80,
        justifyContent: 'center',
        color:
          status === 'paid'
            ? 'success.main'
            : status === 'unpaid'
              ? 'warning.main'
              : 'error.main',
        letterSpacing: 0.5,
        bgcolor:
          status === 'paid'
            ? 'transparent.success.main'
            : status === 'unpaid'
              ? 'transparent.warning.main'
              : 'transparent.error.main',
        borderColor:
          status === 'paid'
            ? 'transparent.success.main'
            : status === 'unpaid'
              ? 'transparent.warning.main'
              : 'transparent.error.main',
      }}
    />
  );
};

export default StatusChip;

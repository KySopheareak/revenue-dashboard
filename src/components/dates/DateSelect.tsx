import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

interface DateSelectProps {
    value?: Date | null;
    onChange?: (value: Date | null) => void;
}

const DateSelect = ({ value, onChange }: DateSelectProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                views={['month']}
                value={value}
                defaultValue={null}
                format="MMM yyyy"
                onChange={onChange}
                label="    "
                slotProps={{
                    textField: {
                        placeholder: '',
                        variant: 'outlined',
                        size: 'small',
                    },
                }}
                sx={(theme) => ({
                    boxShadow: 0,
                    '& .MuiInputBase-root': {
                        p: 0,
                        border: 'none',
                        background: `${theme.palette.info.dark} !important`,
                    },
                    '& .MuiOutlinedInput-root': {
                        pr: 0.75,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 0,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 0,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 0,
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        p: 1,
                        color: 'text.secondary',
                        fontSize: 'caption.fontSize',
                        fontWeight: 500,
                        width: 60,
                    },
                    '& .MuiIconButton-edgeEnd': {
                        color: 'text.secondary',
                        '& .MuiSvgIcon-fontSizeMedium': {
                            fontSize: 'subtitle1.fontSize',
                        },
                    },
                })}
            />
        </LocalizationProvider>
    );
};

export default DateSelect;
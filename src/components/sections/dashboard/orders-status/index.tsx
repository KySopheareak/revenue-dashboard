import { fontFamily } from 'theme/typography';
import { useState, ChangeEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import DateSelect from 'components/dates/DateSelect';
import IconifyIcon from 'components/base/IconifyIcon';
import OrdersStatusTable from './OrdersStatusTable';
import { Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getProducts } from 'services/dashboardService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Product {
    _id?: string;
    title?: string;
    price?: number;
    stock?: number;
}

const OrdersStatus = () => {
    const [searchText, setSearchText] = useState('');
    const [searchDate, setSearchDate] = useState<Date | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectItem, ItemtoSelects] = useState<string[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                console.log('Fetched products:', response);
                setProducts(response);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleDateChange = (date: Date | null) => {
        setSearchDate(date);
    };

    const handleChange = (event: SelectChangeEvent<typeof selectItem>) => {
        console.log('Selected products:', event.target.value);
        const { target: { value } } = event;
        ItemtoSelects(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    return (
        <Paper sx={{ px: 0 }}>
            <Stack
                px={3.5}
                spacing={1.5}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
            >
                <Stack
                    spacing={2}
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    flexGrow={1}
                >
                    <Typography variant="h6" fontWeight={400} fontFamily={fontFamily.workSans}>
                        Orders Status
                    </Typography>
                    <TextField
                        variant="filled"
                        size="small"
                        placeholder="Search for..."
                        value={searchText}
                        onChange={handleInputChange}
                        sx={{ width: 220 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconifyIcon icon={'mingcute:search-line'} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Stack
                    spacing={1.5}
                    direction={{ xs: 'column-reverse', sm: 'row' }}
                    alignItems={{ xs: 'flex-end', sm: 'center' }}
                >
                    <DateSelect value={searchDate} onChange={handleDateChange} />
                    <Button variant="contained" size="small" onClick={handleOpenDialog}>
                        Create order
                    </Button>
                </Stack>
            </Stack>

            <Box mt={1.5} sx={{ height: 594, width: 1 }}>
                <OrdersStatusTable searchText={searchText} searchDate={searchDate} />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Create Order</DialogTitle>
                <DialogContent sx={{ width: '100%', minHeight: 300 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Search Products
                    </Typography>
                    <TextField
                        variant="filled"
                        size="small"
                        value={searchText}
                        onChange={handleInputChange}
                        sx={{ width: '100%', mb: 2 }}
                    />
                    <FormControl sx={{ mb: 2, width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Select Products
                        </Typography>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectItem}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {products.map((item) => (
                                <MenuItem key={item._id ?? item.title ?? ''} value={item._id ?? ''}>
                                    <Checkbox checked={selectItem.includes(item._id ?? '')} />
                                    <ListItemText primary={item.title ?? String(item)} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>Create</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default OrdersStatus;

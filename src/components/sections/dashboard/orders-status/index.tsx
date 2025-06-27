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
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, MenuItem, Select, Snackbar, Alert } from '@mui/material';
import { createOrder, getProducts } from 'services/dashboardService.service';
import { IOrder } from 'functions/common-interface';
import authenticationService from 'services/authentication.service';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
            fontFamily: fontFamily.workSans,
            fontSize: 0.875,
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
    const [orderItems, setOrderItems] = useState([{ product: '', quantity: 0 }]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
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

    // Handle change for a specific order item
    const handleOrderItemChange = (index: number, field: 'product' | 'quantity', value: string | number) => {
        setOrderItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // Add new order item
    const handleAddOrderItem = () => {
        setOrderItems([...orderItems, { product: '', quantity: 0 }]);
    };

    // Remove order item
    const handleRemoveOrderItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleOpenDialog = () => setOpenDialog(true);

    const handleCloseDialog = async (save: boolean) => {
        setOpenDialog(false)
        if (save) {
            const UserData = authenticationService.getCurrentUser();
            const Json: IOrder = {
                user: UserData?.id,
                products: orderItems
            }
            try {
                const res = await createOrder(Json);
                if(!res) return;
                setOrderItems([{ product: '', quantity: 0 }]);
                setRefreshTrigger(prev => prev + 1);
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error creating order:', error);
            }
        }
    };

    const handleSnackbarClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <Paper sx={{ px: 0 }}>
            <Stack px={3.5} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" flexGrow={1}>
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
                <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} alignItems={{ xs: 'flex-end', sm: 'center' }}>
                    <DateSelect value={searchDate} onChange={handleDateChange} />
                    <Button variant="contained" size="small" onClick={handleOpenDialog}>
                        Create order
                    </Button>
                </Stack>
            </Stack>

            <Box mt={1.5} sx={{ height: 594, width: 1 }}>
                <OrdersStatusTable searchText={searchText} searchDate={searchDate} refreshTrigger={refreshTrigger} products={products} />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Create Order</DialogTitle>
                <DialogContent sx={{ width: '100%', height: 350 }}>
                    {orderItems.map((item, idx) => (
                        <Box key={idx}>
                            <Typography variant="body1" sx={{ flex: 0.5, fontSize: '0.8rem', fontWeight: 700, position: 'relative', top: 68, left: -25 }}>
                                {idx + 1}
                            </Typography>
                            <Box sx={{ mb: 2, position: 'relative', display: 'flex', flexDirection: 'column', gap: 1, p: 2, borderRadius: 1, border: '1px solid #ccc', width: '80%' }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Typography variant="body1" sx={{ flex: 0.5, fontSize: '0.7rem' }}>
                                        Product
                                    </Typography>
                                    <FormControl sx={{ flex: 5, minWidth: 200 }}>
                                        <Select
                                            value={item.product}
                                            onChange={(e) => handleOrderItemChange(idx, 'product', e.target.value)}
                                            displayEmpty
                                            size="small"
                                            MenuProps={MenuProps}
                                            sx={{ '& .MuiSelect-icon': { color: 'white' } }}>
                                            <MenuItem value="">
                                                <span>-- None --</span>
                                            </MenuItem>
                                            {products.map((prod) => (
                                                <MenuItem key={prod._id} value={prod._id}>
                                                    {prod.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box display="flex" alignItems="center" gap={2}>
                                    <Typography variant="body1" sx={{ flex: 0.5, fontSize: '0.7rem' }}>
                                        Quantity
                                    </Typography>
                                    <FormControl sx={{ flex: 5, minWidth: 200 }}>
                                        <TextField
                                            type="number"
                                            placeholder="Quantity"
                                            size="small"
                                            value={item.quantity}
                                            onChange={(e) => handleOrderItemChange(idx, 'quantity', Number(e.target.value))}
                                            inputProps={{ min: 1 }}
                                        />
                                    </FormControl>
                                </Box>

                                <Button
                                    onClick={() => handleRemoveOrderItem(idx)}
                                    disabled={orderItems.length === 1}
                                    sx={{ position: 'absolute', right: -100, mt: 2.5 }}
                                    color="error">
                                    Remove
                                </Button>
                            </Box>
                        </Box>
                    ))}

                    <Button onClick={handleAddOrderItem} variant="outlined" startIcon={<IconifyIcon icon={'mdi:plus'} />}
                        sx={{ mb: 2, minWidth: '100px', alignItems: 'center', display: 'flex', justifyContent: 'center', left: 'calc(40% - 50px)' }}>
                        Add Product
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleCloseDialog(true)}>Create</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Successfully!
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default OrdersStatus;

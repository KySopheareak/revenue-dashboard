import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ordersStatusData } from 'data/ordersStatusData';
import { Alert, Box, DialogContentText, Snackbar } from '@mui/material';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import StatusChip from 'components/chips/StatusChip';
import IconifyIcon from 'components/base/IconifyIcon';
import DataGridFooter from 'components/common/DataGridFooter';
import {
    GridRowModesModel,
    DataGrid,
    GridApi,
    GridColDef,
    GridActionsCellItem,
    useGridApiRef,
} from '@mui/x-data-grid';
import { createOrder, deleteOrder, getOrderById, getOrderStatus } from 'services/dashboardService.service';
import { formatNumber } from 'functions/formatNumber';
import { fontFamily } from 'theme/typography';
import { RESPONSE_STATUS } from 'functions/response-status.enums';
import authenticationService from 'services/authentication.service';
import { IOrder } from 'functions/common-interface';

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
interface OrdersStatusTableProps {
    searchText: string;
    searchDate: Date | null;
    refreshTrigger: number;
    products: Product[];
}

interface Product {
    _id?: string;
    title?: string;
    price?: number;
    stock?: number;
}

const OrdersStatusTable = ({ searchText, searchDate, refreshTrigger, products }: OrdersStatusTableProps) => {
    const apiRef = useGridApiRef<GridApi>();
    const [rows, setRows] = useState(ordersStatusData);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [orderItems, setOrderItems] = useState([{ product: '', quantity: 0, status: '' }]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isView, setIsView] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [recordID, setRecordID] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const data = await getOrderStatus(searchText, searchDate);
            const mappedRows = data.map((row) => ({
                ...row,
                id: row._id,
            }));
            setRows(mappedRows);
        } catch (error) {
            setRows([]);
        }
    }, [searchText, searchDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshTrigger]);

    // Handle change for a specific order item
    const handleOrderItemChange = (index: number, field: 'product' | 'quantity', value: string | number) => {
        setOrderItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // Add new order item
    const handleAddOrderItem = async (id: number | string, viewMode: boolean) => {
        setIsView(viewMode);
        setOpenDialog(true);
        try {
            const order = await getOrderById(id.toString());
            if (order) {
                setOrderItems(order.products.map((item: { product: { _id: string }; quantity: number, status: string }) => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    status: order.status
                })));
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    // Remove order item
    const handleRemoveOrderItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleConfirmDeletion = async (id: number | string) => {
        setOpenConfirmDialog(true);
        setRecordID(null);
        setRecordID(id.toString());
    }

    const handleCloseConfirmDialog = (confrimed: boolean) => {
        if (confrimed) {
            setOpenConfirmDialog(false);
            handleDeleteClick(recordID || '');
        } else {
            setOpenConfirmDialog(false);
        }
    }

    const handleDeleteClick = async (id: number | string) => {
        const response = await deleteOrder(id.toString());
        if (response.status !== RESPONSE_STATUS.SUCCESS) return;
        setSnackbarOpen(true);
        await fetchData();
    };

    const handleCloseDialog = async (save: boolean) => {
        setOpenDialog(false)
        if (save) {
            const UserData = authenticationService.getCurrentUser();
            const Json: IOrder = {
                user: UserData?.id,
                products: orderItems
            }
            try {
                await createOrder(Json);
                setOrderItems([{ product: '', quantity: 0, status: '' }]);
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

    const columns: GridColDef[] = [
        {
            field: 'user',
            headerName: 'User',
            flex: 2,
            minWidth: 180,
            resizable: false,
            renderHeader: () => (
                <Stack alignItems="center" marginLeft="50px" gap={0.75}>
                    <IconifyIcon icon="mingcute:user-2-fill" color="neutral.main" fontSize="body2.fontSize" />
                    <Typography variant="caption" mt={0.25} letterSpacing={0.5}>
                        User
                    </Typography>
                </Stack>
            ),
            valueGetter: (params: { username: string; email: string }) => {
                return `${params.username} ${params.email}`;
            },
            renderCell: (params) => {
                return (
                    <Stack direction="column" marginLeft="50px" alignSelf="center" justifyContent="center" sx={{ height: 1 }}>
                        <Typography variant="subtitle1" fontSize="caption.fontSize">
                            {params.row.user.username}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="caption.fontSize">
                            {params.row.user.email}
                        </Typography>
                    </Stack>
                );
            },
            sortComparator: (v1, v2) => v1.localeCompare(v2),
        },
        {
            field: 'order_date',
            type: 'date',
            headerName: 'Date',
            editable: true,
            minWidth: 100,
            flex: 1,
            resizable: false,
            renderHeader: () => (
                <Stack alignItems="center" gap={0.75}>
                    <IconifyIcon icon="mdi:calendar" color="neutral.main" fontSize="body1.fontSize" />
                    <Typography mt={0.175} variant="caption" letterSpacing={0.5}>
                        Order Date
                    </Typography>
                </Stack>
            ),
            valueGetter: (params) => {
                return params ? new Date(params) : null;
            },
            renderCell: (params) => params.value ? format(new Date(params.value), 'MMM dd yyyy') : null,
        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: false,
            minWidth: 120,
            flex: 1,
            resizable: false,
            renderHeader: () => (
                <Stack alignItems="center" gap={0.875}>
                    <IconifyIcon
                        icon="carbon:checkbox-checked-filled"
                        color="neutral.main"
                        fontSize="body1.fontSize"
                    />
                    <Typography mt={0.175} variant="caption" letterSpacing={0.5}>
                        Status
                    </Typography>
                </Stack>
            ),
            renderCell: (params) => {
                return (
                    <Stack direction="column" alignSelf="center" justifyContent="center" sx={{ height: 1 }}>
                        <StatusChip status={params.value} />
                    </Stack>
                );
            },
        },
        {
            field: 'products',
            headerName: 'Products',
            sortable: false,
            flex: 1,
            minWidth: 120,
            resizable: false,
            editable: true,
            renderHeader: () => (
                <Stack alignItems="center" gap={0.75}>
                    <IconifyIcon
                        icon="healthicons:geo-location"
                        color="neutral.main"
                        fontSize="h5.fontSize"
                    />
                    <Typography mt={0.175} variant="caption" letterSpacing={0.5}>
                        Products
                    </Typography>
                </Stack>
            ),
            renderCell: (params) => {
                return (
                    <Stack direction="column" alignSelf="center" justifyContent="center" sx={{ height: 1 }}>
                        {Array.isArray(params.row.products) && params.row.products.length > 0 ? (
                            params.row.products.map((item: { title: string }, idx: number) => (
                                <Typography key={idx} variant="subtitle2" fontSize="caption.fontSize">
                                    {item.title}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="subtitle2" color="text.secondary" fontSize="caption.fontSize">
                                No products
                            </Typography>
                        )}
                    </Stack>
                );
            },
        },
        {
            field: 'total_amount',
            headerName: 'Total',
            headerAlign: 'right',
            align: 'right',
            sortable: false,
            minWidth: 120,
            flex: 1,
            resizable: false,
            renderCell: (params) => formatNumber(Number(params.value)),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            minWidth: 120,
            flex: 1,
            cellClassName: 'actions',
            resizable: false,
            renderHeader: () => (
                <Stack alignItems="center" gap={0.75}>
                    <Typography mt={0.175} variant="caption" letterSpacing={0.5}>
                        Action
                    </Typography>
                </Stack>
            ),
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={
                            <IconifyIcon
                                icon="mdi:eye"
                                color="text.secondary"
                                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                            />
                        }
                        label="View/Edit Details"
                        onClick={() => handleAddOrderItem(id, true)}
                        size="small"
                    />,
                    <GridActionsCellItem
                        icon={
                            <IconifyIcon
                                icon="fluent:edit-32-filled"
                                color="text.secondary"
                                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                            />
                        }
                        label="Edit"
                        onClick={() => handleAddOrderItem(id, false)}
                        size="small"
                    />,
                    <GridActionsCellItem
                        icon={
                            <IconifyIcon
                                icon="mingcute:delete-3-fill"
                                color="text.secondary"
                                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                            />
                        }
                        label="Delete"
                        onClick={() => handleConfirmDeletion(id)}
                        size="small"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            <DataGrid
                apiRef={apiRef}
                rows={rows}
                columns={columns}
                rowHeight={80}
                editMode="row"
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 6,
                        },
                    },
                }}
                checkboxSelection
                pageSizeOptions={[6]}
                disableColumnMenu
                disableVirtualization
                disableRowSelectionOnClick
                rowModesModel={rowModesModel}
                slots={{
                    pagination: DataGridFooter,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth sx={{ padding: 2 }}>
                <DialogTitle>{isView ? 'Order Detail' : 'Edit Order'}</DialogTitle>
                <DialogContent>
                    <Stack sx={{ height: 1, display: 'flex', alignSelf: 'end', position: 'absolute', right: 20, top: 50, gap: 1, flexDirection: 'row' }}>
                        <StatusChip status={orderItems[0].status === 'paid' ? 'paid' : orderItems[0].status === 'unpaid' ? 'unpaid' : 'canceled'} />
                    </Stack>
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
                                            disabled={isView}
                                            value={item.product}
                                            onChange={(e) => handleOrderItemChange(idx, 'product', e.target.value)}
                                            displayEmpty
                                            size="small"
                                            MenuProps={MenuProps}
                                            sx={{
                                                '& .MuiSelect-icon': { color: 'white' },
                                                '& .css-1a6q9hs-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: 'white', color: 'white' },
                                            }}>
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
                                            disabled={isView}
                                            type="number"
                                            placeholder="Quantity"
                                            size="small"
                                            value={item.quantity}
                                            onChange={(e) => handleOrderItemChange(idx, 'quantity', Number(e.target.value))}
                                            inputProps={{ min: 1 }}
                                            sx={{ '& .css-1qpqwi7-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: 'white', color: 'white' }, }}
                                        />
                                    </FormControl>
                                </Box>

                                <Button
                                    onClick={() => handleRemoveOrderItem(idx)}
                                    disabled={orderItems.length === 1 || isView}
                                    sx={{ position: 'absolute', right: -100, mt: 2.5 }}
                                    color="error">
                                    Remove
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        disabled={isView}
                        onClick={() => handleCloseDialog(true)}
                        color="primary"
                        variant="contained"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Save successful!
                </Alert>
            </Snackbar>
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this order? <br></br> This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseConfirmDialog(false)}>Disagree</Button>
                    <Button onClick={() => handleCloseConfirmDialog(true)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrdersStatusTable;

import { fontFamily } from 'theme/typography';
import UserTable from './userTable';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, MenuItem, Paper, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { ChangeEvent, useState } from 'react';
import { createUser, deleteUser, getUserById, updateUser } from 'services/dashboardService.service';
import { RESPONSE_STATUS } from 'functions/response-status.enums';

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

const User = () => {
    const [searchText, setSearchText] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isCreate, setIsCreate] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        type: ''
    })
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const types = [
        { _id: 'admin', name: 'Admin' },
        { _id: 'client', name: 'Client' },
    ]

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleOpenDialog = async (id?: string, mode?: { isView?: boolean; isEdit?: boolean; isCreate?: boolean }) => {
        if (id) {
            setUserId(id);
            const res = await getUserById(id);
            if (res) {
                setUserData({
                    username: res.username,
                    email: res.email,
                    password: '',
                    type: res.type
                });
            }
        } else {
            setUserData({ username: '', email: '', password: '', type: '' });
            setIsView(false);
            setIsEdit(false);
            setIsCreate(true);
        }

        if (mode) {
            setIsView(mode.isView || false);
            setIsEdit(mode.isEdit || false);
            setIsCreate(mode.isCreate || false);
        }

        setOpenDialog(true);
    };

    const handleCloseDialog = async (save: boolean, id: string | null) => {
        setOpenDialog(false)
        if (save && !id) {
            try {
                const res = await createUser(userData);
                if (!res) return;
                setUserData({ username: '', email: '', password: '', type: '' });
                setRefreshTrigger(prev => prev + 1);
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
        if (save && id) {
            try {
                const res = await updateUser(id, userData);
                if (!res) return;
                setUserData({ username: '', email: '', password: '', type: '' });
                setRefreshTrigger(prev => prev + 1);
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    const handleSelectItem = (field: string, value: string) => {
        setUserData({ ...userData, [field]: value });
    };

    const handleSnackbarClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const handleConfirmDeletion = async (id: number | string) => {
        setOpenConfirmDialog(true);
        setUserId(null);
        setUserId(id.toString());
    }

    const handleCloseConfirmDialog = (confirmed: boolean) => {
        if (confirmed) {
            setOpenConfirmDialog(false);
            handleDeleteClick(userId || '');
        } else {
            setOpenConfirmDialog(false);
        }
    };

    const handleDeleteClick = async (id: number | string) => {
        const response = await deleteUser(id.toString());
        if (response.status !== RESPONSE_STATUS.SUCCESS) return;
        setSnackbarOpen(true);
        setRefreshTrigger(prev => prev + 1);
    };


    return (
        <Paper sx={{ px: 0, width: 1, height: '100%' }}>
            <Stack px={3.5} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" flexGrow={1}>
                    <Typography variant="h6" fontWeight={500} fontFamily={fontFamily.workSans}>
                        User List
                    </Typography>
                    <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} alignItems={{ xs: 'flex-end', sm: 'center' }}>
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
                        <Button variant="contained" size="small" onClick={() => handleOpenDialog()}>
                            Create User
                        </Button>
                    </Stack>
                </Stack>
            </Stack>

            <Box sx={{ height: 'calc(100% - 64px)', width: 1, px: 3.5, pt: 2, overflow: 'hidden', boxShadow: 'none' }}>
                <UserTable
                    searchText={searchText}
                    refreshTrigger={refreshTrigger}
                    onView={(id, isView) => handleOpenDialog(id, { isView: isView })}
                    onEdit={(id) => handleOpenDialog(id, { isEdit: true })}
                    onDelete={(id) => handleConfirmDeletion(id)}
                />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isView ? 'View User' : (isEdit ? 'Edit User' : 'Create User')}</DialogTitle>
                <DialogContent sx={{ width: '100%', height: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ mb: 2, position: 'relative', display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
                        <Box display="flex" flexDirection={"column"} gap={2}>
                            <Typography variant="body1" sx={{ flex: 0.5, fontSize: '0.7rem' }}>
                                Username
                            </Typography>
                            <FormControl sx={{ flex: 5, minWidth: 200 }}>
                                <TextField
                                    type="text"
                                    placeholder="Username"
                                    size="small"
                                    required
                                    value={userData.username}
                                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                    disabled={isView}
                                    sx={{ '& .css-1qpqwi7-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: 'white', color: 'white' }, }}
                                />
                            </FormControl>
                        </Box>

                        <Box display="flex" flexDirection={"column"} gap={2}>
                            <Typography variant="body1" sx={{ flex: 0.5, fontSize: '0.7rem' }}>
                                Email
                            </Typography>
                            <FormControl sx={{ flex: 5, minWidth: 200 }}>
                                <TextField
                                    type="text"
                                    placeholder="Email"
                                    size="small"
                                    required
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    disabled={isView}
                                    sx={{ '& .css-1qpqwi7-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: 'white', color: 'white' }, }}
                                />
                            </FormControl>
                        </Box>
                        {(!isView && !isEdit && isCreate) &&
                            <Box display="flex" flexDirection={"column"} gap={2}>
                                <Typography variant="body1" sx={{ flex: 0.5, fontSize: '0.7rem' }}>
                                    Password
                                </Typography>
                                <FormControl sx={{ flex: 5, minWidth: 200 }}>
                                    <TextField
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="password"
                                        size="small"
                                        required
                                        value={userData.password}
                                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                        inputProps={{ minLength: 8, maxLength: 12 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ opacity: userData.password ? 1 : 0 }}>
                                                    <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        autoComplete=""
                                        disabled={isView}
                                        sx={{ '& .css-1qpqwi7-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: 'white', color: 'white' }, }}
                                    />
                                </FormControl>
                            </Box>
                        }
                        <Box display="flex" flexDirection={"column"} gap={2}>
                            <Typography variant="body1" sx={{ flex: 0.5, fontSize: '0.7rem' }}>
                                Type
                            </Typography>
                            <FormControl sx={{ flex: 5, minWidth: 200 }}>
                                <Select
                                    value={userData.type}
                                    onChange={(e) => handleSelectItem('type', e.target.value)}
                                    displayEmpty
                                    size="small"
                                    MenuProps={MenuProps}
                                    sx={{
                                        '& .MuiSelect-icon': { color: 'white' },
                                        '& .css-1a6q9hs-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: 'white', color: 'white' },
                                    }}
                                    disabled={isView}>
                                    <MenuItem value="">
                                        <span>-- None --</span>
                                    </MenuItem>
                                    {types.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog(false, null)}>Cancel</Button>
                    {isCreate && (
                        <Button variant="contained" onClick={() => handleCloseDialog(true, null)}>Create</Button>
                    )}
                    {isEdit && (
                        <Button variant="contained" onClick={() => handleCloseDialog(true, userId)}>Save</Button>
                    )}
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
                        Are you sure you want to delete this user? <br></br> This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseConfirmDialog(false)}>Disagree</Button>
                    <Button onClick={() => handleCloseConfirmDialog(true)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default User;

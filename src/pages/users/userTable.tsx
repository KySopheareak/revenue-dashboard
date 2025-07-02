import { Box, Stack, Typography } from "@mui/material";
import { GridColDef, GridActionsCellItem, DataGrid, useGridApiRef, GridApi, GridRowModesModel, GridRowsProp } from "@mui/x-data-grid";
import IconifyIcon from "components/base/IconifyIcon";
import DataGridFooter from "components/common/DataGridFooter";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { userList } from "services/dashboardService.service";

const CustomNoRowsOverlay = () => {
    return (
        <Stack height="100%" alignItems="center" justifyContent="center" direction="column" spacing={2} sx={{ padding: 4, textAlign: 'center' }}>
            <Box component="img" src="/public/empty-cart.png" alt="No data" sx={{ width: 120, height: 120, opacity: 0.7 }} />
            <Typography variant="h6" color="text.secondary">
                No data available
            </Typography>
            <Typography variant="body2" color="text.disabled">
                There are no records to display at this time
            </Typography>
        </Stack>
    );
};

interface IUserTable {
    searchText?: string;
    searchDate?: Date;
    refreshTrigger?: number;
    onView: (id: string, isView: boolean) => void;
    onEdit: (id: string, isEdit: boolean) => void;
    onDelete: (id: string) => void;
}

const UserTable = ({ searchText, refreshTrigger, onView, onEdit, onDelete }: IUserTable) => {
    const UserData: GridRowsProp = []
    const apiRef = useGridApiRef<GridApi>();
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rows, setRows] = useState(UserData);

    const fetchData = useCallback(async () => {
        try {
            const data = await userList(searchText);
            const mappedRows = data.map((row) => ({
                ...row,
                id: row._id,
            }));
            setRows(mappedRows);
        } catch (error) {
            setRows([]);
        }
    }, [searchText]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshTrigger]);

    const columns: GridColDef[] = [
        {
            field: 'username',
            headerName: 'User',
            flex: 2,
            minWidth: 180,
            sortable: false,
            renderHeader: () => (
                <Stack alignItems="center" marginLeft="50px" gap={0.75}>
                    <IconifyIcon icon="mingcute:user-2-fill" color="neutral.main" fontSize="body2.fontSize" />
                    <Typography variant="caption" mt={0.25} letterSpacing={0.5}>
                        Username
                    </Typography>
                </Stack>
            ),
            renderCell: (params) => {
                return (
                    <Stack alignItems="center" marginLeft="70px" gap={0.75}>
                        {params.value ? params.value : '-'}
                    </Stack>
                )
            },
        },
        {
            field: 'type',
            headerName: 'Type',
            minWidth: 100,
            flex: 1,
            sortable: false,
            renderHeader: () => (
                <Stack alignItems="center" gap={0.75}>
                    <IconifyIcon icon="mingcute:briefcase-2-fill" color="neutral.main" fontSize="body1.fontSize" />
                    <Typography mt={0.175} variant="caption" letterSpacing={0.5}>
                        Type
                    </Typography>
                </Stack>
            ),
            renderCell: (params) => params.value ? params.value : '-',
        },
        {
            field: 'email',
            headerName: 'Email',
            sortable: false,
            flex: 1,
            minWidth: 120,
            resizable: false,
            editable: true,
            renderHeader: () => (
                <Stack alignItems="center" gap={0.75}>
                    <IconifyIcon
                        icon="mingcute:mail-line"
                        color="neutral.main"
                        fontSize="h5.fontSize"
                    />
                    <Typography mt={0.175} variant="caption" letterSpacing={0.5}>
                        Email
                    </Typography>
                </Stack>
            ),
            renderCell: (params) => params.value,
        },
        {
            field: 'updatedAt',
            headerName: 'Created At',
            sortable: false,
            minWidth: 120,
            flex: 1,
            resizable: false,
            renderHeader: () => (
                <Stack alignItems="center" gap={0.75}>
                    <IconifyIcon
                        icon="mdi:calendar"
                        color="neutral.main"
                        fontSize="h5.fontSize"
                    />
                    <Typography mt={0.175} variant="caption" letterSpacing={0.5}>
                        Create At
                    </Typography>
                </Stack>
            ),
            renderCell: (params) => params.value ? format(new Date(params.value), 'MMM dd yyyy') : null,
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
            // getActions: ({ id }) => {
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
                        onClick={() => onView(id as string, true)}
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
                        onClick={() => onEdit(id as string, true)}
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
                        onClick={() => onDelete(id as string)}
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
                pageSizeOptions={[6]}
                disableColumnMenu
                disableVirtualization
                disableRowSelectionOnClick
                rowModesModel={rowModesModel}
                slots={{
                    pagination: DataGridFooter,
                    noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </>
    )
}

export default UserTable;
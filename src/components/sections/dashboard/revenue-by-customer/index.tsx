import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import RateChip from 'components/chips/RateChip';
import DateSelect from 'components/dates/DateSelect';
import EChartsReactCore from 'echarts-for-react/lib/core';
import RevenueChartLegends from './RevenueChartLegends';
import RevenueChart from './RevenueChart';
import { getOrderStats } from 'services/dashboardService';
import { formatThousand } from 'functions/formatNumber';

interface RevenueData {
    monthly: string[];
    series: {
        name: string;
        data: number[];
    }[];
    totalOrders: number;
};


const RevenueDataContext = createContext<RevenueData | undefined>(undefined);

export const useRevenueData = () => useContext(RevenueDataContext);

const RevenueByCustomer = () => {
    const chartRef = useRef<EChartsReactCore>(null);

    const [revenueData, setRevenueData] = useState<RevenueData | undefined>(undefined);

    useEffect(() => {
        const getData = async () => {
            const response = await getOrderStats();
            setRevenueData(response);
        };
        getData();
    }, []);

    if (!revenueData) return <div>Loading...</div>;

    return (
        <Paper sx={{ height: { xs: 540, md: 500 } }}>
            {/* header */}
            <Typography variant="subtitle1" color="text.secondary">
                Product Order By Customer
            </Typography>

            {/* subheader */}
            <Stack justifyContent="space-between" mt={1}>
                <Stack alignItems="center" gap={0.875}>
                    <Typography variant="h3" fontWeight={600} letterSpacing={1}>
                        ${formatThousand(Number(revenueData?.totalOrders || 0))}
                    </Typography>
                    <RateChip rate={'14.8%'} isUp={true} />
                </Stack>

                <Stack alignItems="center" spacing={2}>
                    <Box display={{ xs: 'none', md: 'block' }}>
                        <RevenueDataContext.Provider value={revenueData}>
                            <RevenueChartLegends chartRef={chartRef} sm={false} />
                        </RevenueDataContext.Provider>
                    </Box>
                    <DateSelect />
                </Stack>
            </Stack>

            {/* legends for smaller screen */}
            <Box display={{ xs: 'block', md: 'none' }}>
                <RevenueDataContext.Provider value={revenueData}>
                    <RevenueChartLegends chartRef={chartRef} sm={true} />
                </RevenueDataContext.Provider>
            </Box>

            {/* stacked bar chart */}
            <Box height={400}>
                <RevenueDataContext.Provider value={revenueData}>
                    <RevenueChart chartRef={chartRef} data={revenueData} sx={{ minHeight: 1 }} />
                </RevenueDataContext.Provider>
            </Box>
        </Paper>
    );
};

export default RevenueByCustomer;

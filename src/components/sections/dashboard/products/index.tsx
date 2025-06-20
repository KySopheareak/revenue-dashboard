import { fontFamily } from 'theme/typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Product from './Product';
import { useEffect, useState } from 'react';
import { getProducts } from 'services/dashboardService';

type ProductData = {
    _id: string;
    title: string;
    price: number;
    thumbnail: string;
    stock: number | string;
}

const Products = () => {
    const [productsData, setProductsData] = useState<ProductData[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await getProducts();
            setProductsData(response);
        };
        fetchData();
    }, []);

    return (
        <Stack direction="column" gap={3.75} component={Paper} p={2.5} width={1} sx={{ height: 500 }}>
            <Typography variant="h6" fontWeight={400} fontFamily={fontFamily.workSans}>
                Products
            </Typography>

            <Stack justifyContent="space-between">
                <Typography variant="caption" fontWeight={400}>
                    Products
                </Typography>

                <Typography variant="caption" fontWeight={400}>
                    Price
                </Typography>
            </Stack>

            <Stack direction="column" gap={1} sx={{ overflowY: 'auto', flex: 1, maxHeight: '400px' }}>
                {productsData.map((item) => {
                    return <Product key={item._id} data={item} />;
                })}
            </Stack>
        </Stack>
    );
};

export default Products;

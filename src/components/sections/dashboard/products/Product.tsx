import { fontFamily } from 'theme/typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'components/base/Image';

interface ProductInfoProps {
    data: {
        thumbnail: string;
        title: string;
        stock: number | string;
        price: number | string;
        images: string[];
    };
}

const Product = ({ data }: ProductInfoProps) => {
    const { title, stock, price, images } = data;
    return (
        <Stack alignItems="center" justifyContent="space-between">
            <Stack spacing={2} alignItems="center">
                <Box height={46} width={46} bgcolor="info.dark" borderRadius={1.25}>
                    <Image src={images[0]} height={1} width={1} sx={{ objectFit: 'contain' }} />
                </Box>

                <Stack direction="column">
                    <Typography variant="body2" fontWeight={600}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {stock} in stock
                    </Typography>
                </Stack>
            </Stack>

            <Typography variant="caption" fontWeight={400} fontFamily={fontFamily.workSans}>
                $ {price}
            </Typography>
        </Stack>
    );
};

export default Product;

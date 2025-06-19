import { fontFamily } from 'theme/typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

interface LegendProps {
  data: {
    id: number;
    type: string;
  };
  toggleColor: {
    paid: boolean;
    unpaid: boolean;
    cancelled: boolean;
  };
  handleLegendToggle: (seriesName: string) => void;
}

const RevenueChartLegend = ({ data, toggleColor, handleLegendToggle }: LegendProps) => {
  let color = '';

  if (toggleColor.paid && data.type === 'Paid') {
    color = 'primary.main';
  } else if (toggleColor.unpaid && data.type === 'Unpaid') {
    color = 'secondary.lighter';
  } else if (toggleColor.cancelled && data.type === 'Cancelled') {
    color = 'secondary.light';
  } else {
    color = 'text.secondary';
  }

  return (
    <ButtonBase onClick={() => handleLegendToggle(data.type)} disableRipple>
      <Stack spacing={0.5} alignItems="center">
        <Box height={8} width={8} bgcolor={color} borderRadius={1} />
        <Typography variant="body2" color="text.secondary" fontFamily={fontFamily.workSans}>
          {data.type}
        </Typography>
      </Stack>
    </ButtonBase>
  );
};

export default RevenueChartLegend;

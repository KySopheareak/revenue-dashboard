import Grid from '@mui/material/Grid';
import TopCard from './TopCard';
import { useEffect, useState } from 'react';
import { getProductStats } from 'services/dashboardService';
import { formatThousand } from 'functions/formatNumber';

type SummaryData = {
  save_products?: {
    totalFavoriteItems?: number | string;
  };
  products?: {
    totalInventoryValue?: number | string;
    totalProducts?: number | string;
    totalStock?: number | string;
  };
  total_ordered_products?: number | string;
  totalRevenue?: number | string;
};

const TopCards = () => {
  const [summary_data, setSummaryData] = useState<SummaryData | undefined>();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getProductStats();
      setSummaryData(response);
    };
    fetchData();
  }, []);

  const cardsData = [
    {
      id: 1,
      title: 'Save Products',
      value: formatThousand(Number(summary_data?.save_products?.totalFavoriteItems || 0)),
      rate: '28.4%',
      isUp: true,
      icon: 'carbon:favorite-filled',
    },
    {
      id: 2,
      title: 'Stock Products',
      value: formatThousand(Number(summary_data?.products?.totalInventoryValue) || 0),
      rate: '12.6%',
      isUp: false,
      icon: 'solar:bag-bold',
    },
    {
      id: 3,
      title: 'Sale Products',
      value: formatThousand(Number(summary_data?.total_ordered_products) || 0),
      rate: '3.1%',
      isUp: true,
      icon: 'ph:bag-simple-fill',
    },
    {
      id: 4,
      title: 'Average Revenue',
      value: formatThousand(Number(summary_data?.totalRevenue || 0)),
      rate: '11.3%',
      isUp: true,
      icon: 'mingcute:currency-dollar-2-line',
    },
  ];
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      {cardsData.map((item) => {
        return (
          <TopCard
            key={item.id}
            title={item.title}
            value={item.value}
            rate={item.rate}
            isUp={item.isUp}
            icon={item.icon}
          />
        );
      })}
    </Grid>
  );
};

export default TopCards;

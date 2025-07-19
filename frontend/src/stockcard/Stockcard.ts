export interface Stockcard{
    title: string;
    price: number;
    change: number;
    chartData?: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
            tension: number;
            fill: boolean;
        }[];
    };
}
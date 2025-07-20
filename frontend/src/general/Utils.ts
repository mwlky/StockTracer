export const fetchStockData = async (stockId: string) => {
  try {
    const url = import.meta.env.VITE_API_URL;

    const response = await fetch(`${url}/stock?symbol=${stockId}`);
    if (!response.ok) {
      throw new Error(`Error fetching data for ${stockId}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
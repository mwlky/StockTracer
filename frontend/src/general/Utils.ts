export const fetchStockData = async (stockId: string) => {
  try {
    const response = await fetch(`http://localhost:7133/api/stock?symbol=${stockId}`);
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
using System.Text.Json;

namespace StockTracer.Backend
{
    public sealed class StockService(HttpClient _httpClient)
    {
        private const string ApiKey = "d1rsv5pr01qv01rfhga0d1rsv5pr01qv01rfhgag";

        public async Task<StockData?> GetStockAsync(string symbol)
        { 
            var url = $"https://finnhub.io/api/v1/quote?symbol={symbol.ToUpper()}&token={ApiKey}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStreamAsync();

            return JsonSerializer.Deserialize<StockData?>(json);
        }
    }
}

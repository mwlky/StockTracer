using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace StockTracer.Backend
{
    public class Functions(StockService _stockService)
    {
        private static readonly string[] AllowedOrigins = new[]
        {
            "http://localhost:5173",
            "https://purple-forest-009737803.2.azurestaticapps.net"
        };

        [Function("GetStock")]
        public async Task<HttpResponseData> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "stock")]
            HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger("GetStock");

            string? origin = req.Headers.TryGetValues("Origin", out var originValues)
                ? originValues.FirstOrDefault()
                : null;

            bool isAllowedOrigin = origin != null && AllowedOrigins.Contains(origin);

            if (req.Method == "OPTIONS")
            {
                var preflight = req.CreateResponse(HttpStatusCode.OK);

                if (isAllowedOrigin)
                    preflight.Headers.Add("Access-Control-Allow-Origin", origin!);

                preflight.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
                preflight.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
                preflight.Headers.Add("Access-Control-Max-Age", "86400");

                return preflight;
            }

            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var symbol = query["symbol"];

            if (string.IsNullOrWhiteSpace(symbol))
            {
                var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                if (isAllowedOrigin)
                    badResponse.Headers.Add("Access-Control-Allow-Origin", origin!);
                await badResponse.WriteStringAsync("Missing 'symbol' query param");
                return badResponse;
            }

            var stock = await _stockService.GetStockAsync(symbol);
            if (stock == null)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                if (isAllowedOrigin)
                    notFound.Headers.Add("Access-Control-Allow-Origin", origin!);
                await notFound.WriteStringAsync("Stock not found or error from API");
                return notFound;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);

            if (isAllowedOrigin)
                response.Headers.Add("Access-Control-Allow-Origin", origin!);

            response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

            await response.WriteAsJsonAsync(stock);
            return response;
        }
    }
}

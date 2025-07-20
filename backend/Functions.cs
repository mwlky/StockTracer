using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace StockTracer.Backend
{
    public class Functions(StockService _stockService)
    {
        [Function("GetStock")]
        public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "stock")]
            HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger("GetStock");
            var allowedOrigins = new[] {
                "http://localhost:5173",
                "https://purple-forest-009737803.2.azurestaticapps.net"
            };

            if (req.Method == "OPTIONS")
            {
                var optionsResponse = req.CreateResponse(HttpStatusCode.OK);
                if (req.Headers.TryGetValues("Origin", out var originValues))
                {
                    var origin = originValues.FirstOrDefault();
                    if (allowedOrigins.Contains(origin))
                    {
                        optionsResponse.Headers.Add("Access-Control-Allow-Origin", origin);
                    }
                }
                optionsResponse.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
                optionsResponse.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
                return optionsResponse;
            }

            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var symbol = query["symbol"];

            if (string.IsNullOrWhiteSpace(symbol))
            {
                var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badResponse.WriteStringAsync("Missing 'symbol' query param");
                return badResponse;
            }

            var stock = await _stockService.GetStockAsync(symbol);
            if (stock == null)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync("Stock not found or error from API");
                return notFound;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            if (req.Headers.TryGetValues("Origin", out var originValues2))
            {
                var origin = originValues2.FirstOrDefault();
                if (allowedOrigins.Contains(origin))
                {
                    response.Headers.Add("Access-Control-Allow-Origin", origin);
                }
            }
            response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

            await response.WriteAsJsonAsync(stock);
            return response;
        }

    }
}
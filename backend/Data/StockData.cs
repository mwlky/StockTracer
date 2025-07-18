using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracer.Backend
{
    public sealed class StockData
    {
        public decimal? c { get; set; }  // Current price
        public decimal? h { get; set; }  // Highest price
        public decimal? l { get; set; }  // Lowest price
        public decimal? o { get; set; }  // Open price
        public decimal? pc { get; set; } // Close price from yesterday
        public decimal? d { get; set; } // Change in price
        public decimal? dp { get; set; } // Percentage Change
        public decimal? t { get; set; } // Timestamp
    }
}

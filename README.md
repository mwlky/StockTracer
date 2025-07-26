# 📈 StockTracer – Real-Time Stock Monitoring App

[![Frontend Deploy](https://github.com/mwlky/StockTracer/actions/workflows/azure-static-web-apps-zealous-pond-004f41403.yml/badge.svg)](https://github.com/mwlky/StockTracer/actions/workflows/azure-static-web-apps-zealous-pond-004f41403.yml)
[![Azure Functions Deploy](https://github.com/mwlky/StockTracer/actions/workflows/main_stocktracer-function.yml/badge.svg)](https://github.com/mwlky/StockTracer/actions/workflows/main_stocktracer-function.yml)

A lightweight stock monitoring app built with **React**, **Azure Functions**, and **TypeScript**, designed for tracking real-time stock prices via a user-friendly interface.

🔗 **Live Demo**: https://zealous-pond-004f41403.1.azurestaticapps.net

---

## 🖼️ Screenshot

![Stock Tracer UI](https://i.imgur.com/RNDYw3d.png)

---

## 🚀 Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Azure Functions (C#), .NET 8
- **API Communication**: `HttpClient` via Azure Functions
- **Deployment**:
  - Frontend → Azure **Static Web App**
  - Backend → Azure **Function App**
- **CI/CD**: GitHub Actions

---

## 🎯 Features

- ✅ Search bar to look up stock tickers
- ✅ Stock tiles displaying:
  - Symbol and company name
  - Current price
  - Percentage change
  - Sparkline chart
- ✅ Drag & drop tile rearrangement (grid-based layout)
- ✅ Responsive UI
- ✅ Fully serverless architecture (no paid backend services)
- 🔄 Docker-based containerization (planned)
- 🔄 Kubernetes deployment (planned)

> ✅ = implemented  
> 🔄 = in progress

---

## ⚙️ How It Works

- The frontend sends requests to an Azure Function API.
- Azure Function uses `HttpClient` to query stock data from a third-party provider.
- Data is processed and sent back to the React app for display.
- Tiles are rendered dynamically and can be moved around using drag & drop.

---

## 📦 How to run locally

### Prerequisites

- Node.js + npm
- .NET 8 SDK
- Azure Functions Core Tools
- VS Code / Visual Studio

### Frontend

```bash
cd frontend
npm install
npm start 
```

### Backend
```bash
cd backend
func start
```

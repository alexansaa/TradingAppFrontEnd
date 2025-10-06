<a name="readme-top"></a>

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
- [💻 Getting Started](#getting-started)
  - [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Run](#run)
  - [Usage](#usage)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [📝 License](#license)

# 📖 Trading App Front-End <a name="about-project"></a>

**Trading App Front-End**
This project represents the Frontend layer of the Trading-App Stack, providing a responsive and real-time web interface for visualizing market data, configuring trades, and monitoring performance analytics.

Built with React + Vite + Tailwind CSS, this layer connects to the Java API for authentication and secure data requests, and to the Python layer for analytics and historical market data visualization.

The application is designed for rapid interaction, modular dashboards, and AI-driven insights, and is deployed using Azure Static Web Apps integrated with Cloudflare tunnels for secure, low-latency delivery.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Core Technologies</summary>
  <ul>
    <li><a href="https://nodejs.org/">Node.js 18 +</a></li>
    <li><a href="https://react.dev/">React 18 +</a></li>
    <li><a href="https://vitejs.dev/">Vite</a></li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://learn.microsoft.com/en-us/azure/static-web-apps/">Azure Static Web Apps</a></li>
    <li><a href="https://www.cloudflare.com/">Cloudflare Tunnels</a></li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

- 💹 **Real Market Visualization** Displays actual and historical stock prices through interactive charts.
- 🔐 **Secure Authentication Flow** Integrates with the Java API using Azure Entra ID and Google Federation.
- 📊 **Dynamic Dashboards** Presents trading signals, price trends, and portfolio metrics in modular components.
- 🌐 **Cross-Service Integration** Communicates seamlessly with both Java (API Gateway) and Python (Data Layer) services.
- ⚡ **Optimized SPA Performance** Uses Vite for lightning-fast builds and hot module replacement during development.
- ☁️ **Cloud-Native Deployment** Deployed via Azure Static Web Apps with custom domains managed through Cloudflare.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js 18 +
- npm or yarn
- Git (to clone the repository and manage source control)
- (optional) Docker, if running alongside backend containers
- Java and Python layers running (for full API functionality)

### Setup

Clone this repository to your desired folder:

```sh
  git clone https://github.com/alexansaa/TradingAppFrontEnd.git
  cd TradingAppFrontEnd
```
Install dependencies:

```sh
  npm install
```

### Run

Start the development server:

```sh
  npm run dev
```
Verify local deployment:

```sh
  http://localhost:80
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 **Alexander**

- GitHub: [https://github.com/alexansaa](https://github.com/alexansaa)
- LinkedIn: [https://www.linkedin.com/in/alexander-saavedra-garcia/](https://www.linkedin.com/in/alexander-saavedra-garcia/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

- [ ] 🤖 **[AI-Assisted Trading Insights]** Integrate predictive recommendations powered by ML models from the Python layer.
- [ ] 🧭 **[User-Configurable Dashboards]** Allow drag-and-drop widget customization.
- [ ] 📈 **[Live WebSocket Updates]** Deliver real-time price and analytics streams.
- [ ] 💬 **[In-App Notifications]** Alert users of price triggers, trading events, and scheduled jobs.
- [ ] 📱 **[Progressive Web App (PWA)]** Add offline access and mobile-first functionality.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/alexansaa/TradingAppFrontEnd/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## ⭐️ Show your support <a name="support"></a>

If you like this project, please give it a star on GitHub

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments <a name="acknowledgements"></a>

I’d like to thank my wife for her patience and unwavering support during my darkest and most isolated days, when completing systems like these demanded every bit of my time, focus, and perseverance

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is licensed under the [GNU](./LICENSE.md) General Public License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

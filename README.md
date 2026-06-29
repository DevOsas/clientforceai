
<div align="center">
  <h2><b>🕹️🕹️ ClientForce UI 🕹️🕹️</b></h2>
  <br/>
</div>

<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
    - [🛠 Built With](#built-with)
        - [Tech Stack](#tech-stack)
- [💻 Getting Started](#getting-started)
    - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [General Requirement](#features-requirement)
    - [Usage](#usage)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)

<!-- PROJECT DESCRIPTION -->

# 📖 ClientForce UI <a name="about-project"></a>

**[ClientForce UI]** is the Frontend project for the ClientForce app


### Tech Stack <a name="tech-stack"></a>

- <a href="https://v2.nuxt.com/">Nuxt</a>
- <a href="https://apollo.vuejs.org/">Apollo</a>

<!-- Features -->

### Key Features <a name="key-features"></a>

- [x] Send emails across all application modules

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:

1. git <br>
   use the following link to setup `git` if you dont have it already installed on your computer
<p align="left">(<a href="https://git-scm.com/book/en/v2/Getting-Started-Installing-Git">install git</a>)</p>

2. Nodejs
   Use the following link to install `Nodejs` if you dont have it already installed on your computer
<p align="left">(<a href="https://nodejs.org/en/">install NodeJs</a>)</p>

## Install

Clone repo

```
git clone https://github.com/AptiwHQ/clientforce-ui.git
```
Install dependencies

```
npm install
```
OR
```
 yarn install
```

## Setup
Create a Reverse Proxy server with the same domain as Clientforce-api.

Go to your 'hosts' add your domain, generate a self signed certificate using OpenSSL.

Here are other ways to create a reverse proxy server using popular servers:

1. [Appache](https://www.digitalocean.com/community/tutorials/how-to-use-apache-http-server-as-reverse-proxy-using-mod_proxy-extension)
2. [Ngnix](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04)


### Usage

The following command can be used to run the application.

```
 npm run dev
```
OR
```
yarn dev
```
For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## 🔭 Future Features <a name="future-features"></a>

- [ ] **Customer feedback**
- [ ] **Customer support**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

If you like this project, please don't forget to follow the contributors and give it a star.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Vercel Deployment

This project is configured to deploy to Vercel as a static Nuxt 2 SPA.

### Environment variables

Add these variables in your Vercel project settings:

```bash
APP_API_ROOT=https://your-api-domain.com
APP_FORM_HOST=https://your-form-domain.com
```

You can copy `.env.example` locally when testing the same setup outside Vercel.

### Build settings

- Install command: `npm install`
- Build command: `npm run generate`
- Output directory: `dist`

Client-side routes are configured to fall back to `200.html`, so deep links like `/dashboardv2` work correctly on Vercel.

# COVID&ndash;19 Data Visualization Dashboard

COVID&ndash;19 Data Visualization Dashboard (Greece), is open-source and developed by the team at [Civic Information Office](https://cvcio.org/) in collaboration with [iMEdD Lab](https://github.com/iMEdD-Lab/).

In January 2023 a new Version was released by [Sociality Cooperative](https://sociality.gr).

You can read more about the data in [iMEdD](https://imedd.org/)'s [open-data relevant repository](https://github.com/iMEdD-Lab/open-data) or see in action the [COVID&ndash;19 dashboard](https://lab.imedd.org/covid19/). 


This project is an effort to visualize the spread of the disease in Greece, as the Greek government lacks transparency on this issue. This is an open-source project, so please contribute to make it better.

## Getting started

You will need to run [NodeJS](https://nodejs.org/en/) (>= version 12.16.1). You may consider using a Node version manager such as [nvm](https://github.com/nvm-sh/nvm) to help ensure all dependencies run correclty. Additionaly, you may also use [yarn](https://yarnpkg.com/getting-started/install) as your Node package manager.

##### Clone or Fork

```bash
# clone the repo
git clone https://github.com/iMEdD-Lab/covid-19.git
# cd to directory
cd covid-19
```

##### Environment Variables
In the new folder you will find a `.env` file, where you can set your own environment variables. Read more about Vue CLI [modes and environment variables](https://cli.vuejs.org/guide/mode-and-env.html).

The important keys are `VUE_APP_BASE_API`, `VUE_APP_GOV_API_KEY` and `VUE_APP_MAPBOX`. The first is the COVID&ndash;19 API url. You can host your own API or you can use the public endpoints https://covid.imedd.org. Read more about the API here: [COVID&ndash;19 API](https://github.com/iMEdD-Lab/covid-19-imedd-api). The second one is the token for [Vaccinations Data API](https://www.data.gov.gr/datasets/mdg_emvolio_weekly/). You can get one from here: [Create API Token](https://www.data.gov.gr/token/). Finally, the third is the Mapbox Access Token, which you can get from [Mapbox](https://docs.mapbox.com/help/getting-started/access-tokens/).


##### Install Dependencies
```bash
# install dependencies
yarn
# serve the application locally
yarn serve
```

## Contribution

If you're new to contributing to Open Source on Github, [this guide](https://opensource.guide/how-to-contribute/) can help you get started. Please check out the contribution guide for more details on how issues and pull requests work. Before contributing be sure to review the [code of conduct](https://github.com/cvcio/covid-19/blob/main/CODE_OF_CONDUCT.md).

## Related Repositories

- [COVID&ndash;19 API](https://github.com/iMEdD-Lab/covid-19-imedd-api) (iMEdD Lab)
- [COVID&ndash;19 Open Data](https://github.com/iMEdD-Lab/open-data) (iMEdD Lab)
- [COVID&ndash;19 Application](https://github.com/iMEdD-Lab/covid-19) (iMEdD Lab)

## Previous Versions Repositories

- [COVID&ndash;19 Automation](https://github.com/cvcio/covid-19-automation)
- [COVID&ndash;19 API](https://github.com/cvcio/covid-19-api)
- [COVID&ndash;19 Application](https://github.com/cvcio/covid-19)


## Contributors

- Ilias Dimos ([@dosko64](https://github.com/dosko64))
- Dimitris Papaevagelou ([@andefined](https://github.com/andefined)).
- Sociality Coop ([@socialityCoop](https://github.com/socialityCoop))
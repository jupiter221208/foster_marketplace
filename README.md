![Logo](https://uploads-ssl.webflow.com/61e9ac8c41f3e53272850625/622c1b6a73fd3e4cdd5276d2_Foster%20Logo-p-500.png)

# **Foster Marketplace Web App**

> This repo holds the Foster Marketplace frontend application.

## **Contacts**

#### Leadership

- CEO - [@StealthofFoster](https://github.com/StealthofFoster)
- CXO - [@Plumpadoodle](https://github.com/Plumpadoodle)
- CTO - [@drewburkhart](https://www.github.com/drewburkhart)
- Director of Technology - @RedPrince on Discord

#### Technical

- Client App - [@nicholas716](https://github.com/nicholas716) / [@nshunt639](https://github.com/nshunt639)
- Smart Contract - [@rockdev055](https://github.com/rockdev055)
- Backend/DB/DevOps - [@drewburkhart](https://www.github.com/drewburkhart)

---

## **Tech Stack**

React, TypeScript, Next.js, Web3.js, TailwindCSS

---

## **Installation**

Install with yarn

```bash
  cd client && yarn install
```

---

## **Development**

### Getting Started

Clone the repo, checkout the develop branch and create your working branch from there.

### Branch Naming

Please use the following format for branch names:

`{developer_name_or_tag}/{branch_focus}`

I.e.

`angooba/storybook` or `g33zius/add-pipeline`

### Pull Requests

When you open a PR, a `canary` action will run. This will check for TypeScript compilation errors, run any unit tests and ensure the code will build. If any of these fail, you will need to resolve the issues before the PR can be merged. Be sure to rebase your branch off of the latest develop branch to avoid merge conflicts in your PR's.

### Storybook

When developing UI Components, a corresponding Storybook (`*.stories.tsx`)
component should be created.

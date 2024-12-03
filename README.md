# Todoist Tasks Exporter

A simple Node.js script that exports your Todoist tasks for today and overdue items into a markdown file.

## Features

- Exports today's tasks grouped by project
- Includes overdue tasks
- Generates a dated markdown file (YYYY-MM-DD format)
- Clean, simple markdown output

## Prerequisites

- Node.js installed on your system
- A Todoist account and API token

## Installation

1. Clone this repository or download the files
2. Install dependencies:

```bash
npm install
```


## Setup

1. Get your Todoist API token:
   - Log in to [Todoist](https://todoist.com)
   - Go to Settings → Integrations
   - Copy your API token

2. Create a `.env` file in the project root and add your token:

```bash
TODOIST_API_TOKEN=your_api_token_here
```


## Usage

Run the script:

```bash
node index.js
```

This will create a markdown file named `tasks-YYYY-MM-DD.md` containing your tasks.


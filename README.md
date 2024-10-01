# Meal Explorer

## Overview
Meal Explorer is a dynamic React application that utilizes the React Flow library to visualize a flow of meal categories, meals, ingredients, and details. The app allows users to explore various meal categories and their associated meals, view ingredients, tags, and meal details in an interactive way.

## Features
- **Interactive Flow:** Begin with a start node labeled "Explore" and navigate through meal categories and meals.
- **Dynamic Data Fetching:** Fetches data from TheMealDB API to populate categories, meals, ingredients, and details.
- **Node Navigation:**
  - Click "Explore" to reveal top 5 meal categories.
  - Click on a category to view meals and further details.
  - Access ingredient lists and meal tags as terminal nodes.
  - View detailed information about meals in a sidebar.

## Technologies Used
- **React:** A JavaScript library for building user interfaces.
- **React Flow:** A library for building node-based applications.
- **Axios:** A promise-based HTTP client for making API requests.
- **TheMealDB API:** An API providing meal-related data.
- **Typescript:** Uses Vite + Typescript + React for the development.
- **Tailwind CSS** For further Styling purpose.
## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kunalg3/food-node-app.git
   cd food-node-app
2. Install dependencies:
  ```bash
    npm install
3. Start the development server:
  ```bash
   npm run dev
4. Open your browser and navigate to http://localhost:3000/ or any other port

### Usage
- Click on the "Explore" node to fetch and display the top 5 meal categories.
- Select a category to view associated meals and options for ingredients, tags, and details.
- Explore the meal details in the sidebar when selecting "View Details."
### Future Enhancements
- Implement filtering options for categories and meals.
- Add user authentication for personalized experiences.
- Enable bookmarking of favorite meals.
### License
This project is licensed under the MIT License.

### Acknowledgments
TheMealDB API for providing meal data.
React Flow for making node-based UI development easy.
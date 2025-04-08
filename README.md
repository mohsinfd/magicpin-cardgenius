# Card Savings Calculator

A mobile-first React application that allows users to find the best credit cards based on their spending habits. This app provides an intuitive interface for users to input their spending in various categories via sliders, then fetches and displays personalized card recommendations.

## Features

- Responsive, mobile-first design
- Category-based spending inputs with fluid sliders
- Dynamic forms that change based on the selected category
- Real-time API integration with bank card recommendation service
- Results display with horizontal scrolling for top cards

## Application Flow

1. Users select a spending category (Shopping, Travel, Dining, etc.)
2. Based on the selected category, specific spending input fields appear
3. Users adjust sliders to indicate their monthly spending in each area
4. The app calls an API to fetch personalized card recommendations
5. Results are displayed with top 3 cards in a horizontal scroll and remaining cards in a vertical list

## Technologies Used

- React 18
- Styled Components for styling
- React Slider for the slider controls
- Axios for API requests

## Setup and Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/card-savings-calculator.git
cd card-savings-calculator
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## API Integration

The application connects to the bank card recommendation API at:
```
https://bk-api.bankkaro.com/sp/api/cards
```

Each category has specific form fields and API payload formats to ensure accurate recommendations.

## Project Structure

```
src/
  ├── api/
  │   └── cardsApi.js         # API service integration
  ├── components/
  │   ├── Hero.js             # Hero section component
  │   ├── CategoryList.js     # Category selection component
  │   ├── SpendingForm.js     # Dynamic spending form with sliders
  │   └── CardResults.js      # Results display component
  ├── App.js                  # Main application component
  ├── index.js                # Entry point
  └── index.css               # Global styles
```

## Mobile Optimization

- Optimized layout for mobile devices
- Touch-friendly slider controls
- Fluid transitions
- Lazy loading of card images
- Horizontal scroll with snap points for card browsing

## Future Enhancements

- Add search functionality
- Implement filter options for card networks, banks, etc.
- Add card comparison feature
- Implement user accounts to save preferences 
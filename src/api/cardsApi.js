import axios from 'axios';

const API_URL = 'https://bk-api.bankkaro.com/sp/api/cards';

/**
 * Prepares payload for API request based on category and spending data
 * @param {string} category - Selected spending category
 * @param {object} spendingData - User input spending data
 * @returns {object} API request payload
 */
const preparePayload = (category, spendingData) => {
  // Map category to slug and tag_id
  const categoryMap = {
    'shopping': { slug: 'best-shopping-credit-card', tag_id: '2' },
    'travel': { slug: 'best-travel-credit-card', tag_id: '12' },
    'dining': { slug: 'best-dining-credit-card', tag_id: '6' },
    'grocery': { slug: 'BestCardsforGroceryShopping', tag_id: '7' },
    'bills': { slug: 'best-utility-credit-card', tag_id: '14' },
    'fuel': { slug: 'best-fuel-credit-card', tag_id: '1' },
    'online-food-ordering': { slug: 'online-food-ordering', tag_id: '5' }
  };

  const categoryInfo = categoryMap[category];
  if (!categoryInfo) {
    throw new Error(`Invalid category: ${category}`);
  }
  
  // Prepare the cardGeniusPayload based on category
  let cardGeniusPayload = { tag_id: categoryInfo.tag_id };
  
  // Add category-specific keys based on the selected category
  switch(category) {
    case 'shopping':
      cardGeniusPayload = {
        ...cardGeniusPayload,
        amazon_spends: parseInt(spendingData.amazon_spends) || 0,
        flipkart_spends: parseInt(spendingData.flipkart_spends) || 0,
        other_online_spends: parseInt(spendingData.other_online_spends) || 0
      };
      break;
    case 'travel':
      cardGeniusPayload = {
        ...cardGeniusPayload,
        flights_annual: parseInt(spendingData.flights_annual) || 0,
        hotels_annual: parseInt(spendingData.hotels_annual) || 0
      };
      break;
    case 'dining':
      cardGeniusPayload = {
        ...cardGeniusPayload,
        dining_or_going_out: parseInt(spendingData.dining_or_going_out) || 0
      };
      break;
    case 'grocery':
      cardGeniusPayload = {
        ...cardGeniusPayload,
        grocery_spends_online: parseInt(spendingData.grocery_spends_online) || 0
      };
      break;
    case 'bills':
      cardGeniusPayload = {
        ...cardGeniusPayload,
        water_bills: parseInt(spendingData.water_bills) || 0,
        electricity_bills: parseInt(spendingData.electricity_bills) || 0,
        mobile_phone_bills: parseInt(spendingData.mobile_phone_bills) || 0
      };
      break;
    case 'fuel':
      const fuelValue = spendingData.fuel || spendingData.fuel_spends || 0;
      cardGeniusPayload = {
        ...cardGeniusPayload,
        fuel: parseInt(fuelValue)
      };
      break;
    case 'online-food-ordering':
      cardGeniusPayload = {
        ...cardGeniusPayload,
        online_food_ordering: parseInt(spendingData.online_food_ordering) || 0
      };
      break;
  }

  const payload = {
    banks_ids: [],
    card_networks: [],
    annualFees: "",
    credit_score: "",
    sort_by: "",
    free_cards: "",
    eligiblityPayload: {},
    slug: categoryInfo.slug,
    cardGeniusPayload
  };
  
  console.log('Prepared API payload for category:', category);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  return payload;
};

/**
 * Calculates annual savings based on spending data and card benefits
 * @param {object} card - Card data from API
 * @param {object} spendingData - User's spending data
 * @param {string} category - Selected category
 * @returns {number} Calculated annual savings
 */
const calculateAnnualSavings = (card, spendingData, category) => {
  let annualSavings = 0;
  
  // Get the spending breakdown array from the card
  const spendingBreakdown = card.spending_breakdown_array || [];
  
  // Calculate savings based on category-specific spending
  switch(category) {
    case 'shopping':
      const amazonSpends = parseInt(spendingData.amazon_spends) || 0;
      const flipkartSpends = parseInt(spendingData.flipkart_spends) || 0;
      const otherOnlineSpends = parseInt(spendingData.other_online_spends) || 0;
      
      // Find savings for each spending category
      const amazonSavings = spendingBreakdown.find(item => item.on === 'amazon_spends')?.savings || 0;
      const flipkartSavings = spendingBreakdown.find(item => item.on === 'flipkart_spends')?.savings || 0;
      const otherOnlineSavings = spendingBreakdown.find(item => item.on === 'other_online_spends')?.savings || 0;
      
      annualSavings = (amazonSavings * amazonSpends) + 
                     (flipkartSavings * flipkartSpends) + 
                     (otherOnlineSavings * otherOnlineSpends);
      break;
      
    case 'fuel':
      const fuelSpends = parseInt(spendingData.fuel || spendingData.fuel_spends) || 0;
      const fuelSavings = spendingBreakdown.find(item => item.on === 'fuel')?.savings || 0;
      annualSavings = fuelSavings * fuelSpends;
      break;
      
    case 'travel':
      const flightsSpends = parseInt(spendingData.flights_annual) || 0;
      const hotelsSpends = parseInt(spendingData.hotels_annual) || 0;
      const flightsSavings = spendingBreakdown.find(item => item.on === 'flights_annual')?.savings || 0;
      const hotelsSavings = spendingBreakdown.find(item => item.on === 'hotels_annual')?.savings || 0;
      annualSavings = (flightsSavings * flightsSpends) + (hotelsSavings * hotelsSpends);
      break;
      
    case 'dining':
      const diningSpends = parseInt(spendingData.dining_or_going_out) || 0;
      const diningSavings = spendingBreakdown.find(item => item.on === 'dining_or_going_out')?.savings || 0;
      annualSavings = diningSavings * diningSpends;
      break;
      
    case 'grocery':
      const grocerySpends = parseInt(spendingData.grocery_spends_online) || 0;
      const grocerySavings = spendingBreakdown.find(item => item.on === 'grocery_spends_online')?.savings || 0;
      annualSavings = grocerySavings * grocerySpends;
      break;
      
    case 'bills':
      const waterSpends = parseInt(spendingData.water_bills) || 0;
      const electricitySpends = parseInt(spendingData.electricity_bills) || 0;
      const mobileSpends = parseInt(spendingData.mobile_phone_bills) || 0;
      const waterSavings = spendingBreakdown.find(item => item.on === 'water_bills')?.savings || 0;
      const electricitySavings = spendingBreakdown.find(item => item.on === 'electricity_bills')?.savings || 0;
      const mobileSavings = spendingBreakdown.find(item => item.on === 'mobile_phone_bills')?.savings || 0;
      annualSavings = (waterSavings * waterSpends) + 
                     (electricitySavings * electricitySpends) + 
                     (mobileSavings * mobileSpends);
      break;
    case 'online-food-ordering':
      const foodOrderingSpends = parseInt(spendingData.online_food_ordering) || 0;
      const foodOrderingSavings = spendingBreakdown.find(item => item.on === 'online_food_ordering')?.savings || 0;
      annualSavings = foodOrderingSavings * foodOrderingSpends;
      break;
  }
  
  return annualSavings;
};

/**
 * Fetches card recommendations based on user spending habits
 * @param {string} category - Selected spending category
 * @param {object} spendingData - User input spending data
 * @returns {Promise} Promise resolving to card recommendation data
 */
export const getCardRecommendations = async (category, spendingData) => {
  try {
    if (!category) {
      throw new Error('Category is required');
    }
    
    const payload = preparePayload(category, spendingData);
    console.log(`Making API request to ${API_URL}`);
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    
    if (!response.data || !response.data.data) {
      throw new Error('Empty response from API');
    }

    // Extract filteredCards from the response
    const filteredCards = response.data.data.filteredCards || [];
    console.log('Filtered Cards:', filteredCards);
    
    if (!Array.isArray(filteredCards)) {
      console.error('Invalid API response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid API response format. Expected filteredCards array in response.');
    }
    
    // Return the filtered cards directly since they already have annual_saving calculated
    const result = {
      data: {
        cards: filteredCards,
        filteredCards: filteredCards
      }
    };
    console.log('Returning result:', result);
    return result;
  } catch (error) {
    console.error('Error in getCardRecommendations:', error);
    throw error;
  }
};

export default {
  getCardRecommendations
}; 
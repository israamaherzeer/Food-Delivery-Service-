import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from './Category.js';
import { MenuItem } from './MenuItem.js';

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URL!);
  console.log('✅ Connected to MongoDB');

  const dummyRestaurantId = new mongoose.Types.ObjectId("68623bfadee85992c345a607");

  const category = new Category({
    name: 'Fast Food',
    restaurants: [dummyRestaurantId],
  });

  const menuItem = new MenuItem({
    name: "Cheeseburger",
    description: "Delicious grilled cheeseburger with lettuce and tomato",
    price: 25,
    image_url: "https://example.com/images/cheeseburger.jpg",
    restaurant: dummyRestaurantId
  });

  try {
    const savedCategory = await category.save();
    console.log('✅ Category saved:', savedCategory);

    const savedMenuItem = await menuItem.save();
    console.log('✅ MenuItem saved:', savedMenuItem);

  } catch (error) {
    console.error('❌ Error saving data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main();

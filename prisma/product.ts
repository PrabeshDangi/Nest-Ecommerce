import { Size } from "@prisma/client";

export const products=[
    {
      "id": 1,
      "title": "Stylish Sneakers",
      "price": 49.99,
      "image": [
        "https://dummyjson.com/image1.jpg",
        "https://dummyjson.com/image2.jpg"
      ],
      "discounttag": true,
      "rating": 4.5,
      "discountprice": 39.99,
      "sizes": Size.m,
      "returnpolicy": "30 days return policy",
      "description": "Comfortable and stylish sneakers for everyday wear.",
      "brand": "SneakerCo",
      "availability": true,
      "categories": 'Footwear'
    },
    {
      "id": 2,
      "title": "Classic Leather Jacket",
      "price": 89.99,
      "image": [
        "https://dummyjson.com/image3.jpg"
      ],
      "discounttag": false,
      "rating": 4.8,
      
      "sizes":  Size.l,
      "returnpolicy": "No returns after 15 days",
      "description": "A timeless leather jacket that never goes out of style.",
      "brand": "LeatherLux",
      "availability": true,
      "categories": 'Apparel'
    },
    {
      "id": 3,
      "title": "Wireless Headphones",
      "price": 59.99,
      "image": [
        "https://dummyjson.com/image4.jpg",
        "https://dummyjson.com/image5.jpg"
      ],
      "discounttag": true,
      "rating": 4.2,
      "discountprice": 49.99,
      "sizes": null,
      "returnpolicy": "1 year warranty",
      "description": "High-quality wireless headphones with noise cancellation.",
      "brand": "AudioTech",
      "availability": true,
      "categories": "Electronics"
    },
    {
      "id": 4,
      "title": "Smartwatch",
      "price": 199.99,
      "image": [
        "https://dummyjson.com/image6.jpg"
      ],
      "discounttag": true,
      "rating": 4.7,
      "discountprice": 179.99,
      "sizes": null,
      "returnpolicy": "Returns accepted within 30 days",
      "description": "Feature-packed smartwatch with fitness tracking.",
      "brand": "TechWear",
      "availability": false,
      "categories": "Wearables"
    },
      {
        "id": 5,
        "title": "Bluetooth Speaker",
        "price": 29.99,
        "image": [
          "https://dummyjson.com/image7.jpg",
          "https://dummyjson.com/image8.jpg"
        ],
        "discounttag": true,
        "rating": 4.3,
        "discountprice": 24.99,
        "sizes": null,
        "returnpolicy": "30 days return policy",
        "description": "Portable Bluetooth speaker with excellent sound quality.",
        "brand": "SoundWave",
        "availability": true,
        "categories": "Electronics"
      },
      {
        "id": 6,
        "title": "Yoga Mat",
        "price": 19.99,
        "image": [
          "https://dummyjson.com/image9.jpg"
        ],
        "discounttag": false,
        "rating": 4.6,
        "discountprice": null,
        "sizes": null,
        "returnpolicy": "Returns accepted within 30 days",
        "description": "Non-slip yoga mat for comfortable workouts.",
        "brand": "FitLife",
        "availability": true,
        "categories": "Fitness"
      },
      {
        "id": 7,
        "title": "Coffee Maker",
        "price": 49.99,
        "image": [
          "https://dummyjson.com/image10.jpg"
        ],
        "discounttag": true,
        "rating": 4.5,
        "discountprice": 39.99,
        "sizes": null,
        "returnpolicy": "1 year warranty",
        "description": "Automatic coffee maker for brewing delicious coffee.",
        "brand": "BrewMaster",
        "availability": true,
        "categories": "Home Appliances"
      },
      {
        "id": 8,
        "title": "Gaming Mouse",
        "price": 59.99,
        "image": [
          "https://dummyjson.com/image11.jpg"
        ],
        "discounttag": false,
        "rating": 4.8,
        "discountprice": null,
        "sizes": null,
        "returnpolicy": "30 days return policy",
        "description": "High-precision gaming mouse with customizable buttons.",
        "brand": "GamerPro",
        "availability": true,
        "categories": "Gaming"
      },
      {
        "id": 9,
        "title": "LED Desk Lamp",
        "price": 39.99,
        "image": [
          "https://dummyjson.com/image12.jpg"
        ],
        "discounttag": true,
        "rating": 4.2,
        "discountprice": 29.99,
        "sizes": null,
        "returnpolicy": "Returns accepted within 30 days",
        "description": "Adjustable LED desk lamp with multiple brightness settings.",
        "brand": "BrightLight",
        "availability": true,
        "categories": "Home Decor"
      },
      {
        "id": 10,
        "title": "Fitness Tracker",
        "price": 79.99,
        "image": [
          "https://dummyjson.com/image13.jpg"
        ],
        "discounttag": false,
        "rating": 4.6,
        "discountprice": null,
        "sizes": null,
        "returnpolicy": "1 year warranty",
        "description": "Track your fitness goals with this advanced fitness tracker.",
        "brand": "HealthTech",
        "availability": true,
        "categories": "Wearables"
      },
      {
        "id": 11,
        "title": "Portable Charger",
        "price": 24.99,
        "image": [
          "https://dummyjson.com/image14.jpg"
        ],
        "discounttag": false,
        "rating": 4.4,
        "discountprice": null,
        "sizes": null,
        "returnpolicy": "30 days return policy",
        "description": "Compact portable charger with fast charging capability.",
        "brand": "PowerBank",
        "availability": true,
        "categories": "Accessories"
      },
      {
        "id": 12,
        "title": "Electric Kettle",
        "price": 39.99,
        "image": [
          "https://dummyjson.com/image15.jpg"
        ],
        "discounttag": true,
        "rating": 4.5,
        "discountprice": 29.99,
        "sizes": null,
        "returnpolicy": "1 year warranty",
        "description": "Quick boiling electric kettle with auto shut-off feature.",
        "brand": "KitchenPro",
        "availability": true,
        "categories":"Home Appliances"
      },
      {
        "id": 13,
        "title": "Graphic T-Shirt",
        "price": 19.99,
        "image": [
          "https://dummyjson.com/image16.jpg"
        ],
        "discounttag": false,
        "rating": 4.3,
        "discountprice": null,
        "sizes": Size.m,
        "returnpolicy": "Returns accepted within 30 days",
        "description": "Comfortable graphic t-shirt for casual wear.",
        "brand": "FashionCo",
        "availability": true,
        "categories": "Apparel"
      },
      {
        "id": 14,
        "title": "Wireless Charger",
        "price": 29.99,
        "image": [
          "https://dummyjson.com/image17.jpg"
        ],
        "discounttag": true,
        "rating": 4.6,
        "discountprice": 19.99,
        "sizes": null,
        "returnpolicy": "30 days return policy",
        "description": "Fast wireless charger compatible with most smartphones.",
        "brand": "ChargePro",
        "availability": true,
        "categories":"Accessories"
      },
        {
          "id": 15,
          "title": "Men's Casual Shoes",
          "price": 59.99,
          "image": [
            "https://dummyjson.com/image18.jpg",
            "https://dummyjson.com/image19.jpg"
          ],
          "discounttag": true,
          "rating": 4.4,
          "discountprice": 49.99,
          "sizes": Size.l,
          "returnpolicy": "30 days return policy",
          "description": "Stylish and comfortable casual shoes for men.",
          "brand": "CasualStep",
          "availability": true,
          "categories": "Footwear"
        },
        {
          "id": 16,
          "title": "Wireless Earbuds",
          "price": 79.99,
          "image": [
            "https://dummyjson.com/image20.jpg"
          ],
          "discounttag": false,
          "rating": 4.7,
          "discountprice": null,
          "sizes": null,
          "returnpolicy": "1 year warranty",
          "description": "High-quality wireless earbuds with noise isolation.",
          "brand": "SoundBuds",
          "availability": true,
          "categories": "Electronics"
        },
        {
          "id": 17,
          "title": "Smartphone Stand",
          "price": 15.99,
          "image": [
            "https://dummyjson.com/image21.jpg"
          ],
          "discounttag": true,
          "rating": 4.5,
          "discountprice": 12.99,
          "sizes": null,
          "returnpolicy": "30 days return policy",
          "description": "Adjustable smartphone stand for hands-free use.",
          "brand": "GadgetPro",
          "availability": true,
          "categories": "Accessories"
        },
        {
          "id": 18,
          "title": "Electric Toothbrush",
          "price": 39.99,
          "image": [
            "https://dummyjson.com/image22.jpg"
          ],
          "discounttag": false,
          "rating": 4.8,
          "discountprice": null,
          "sizes": null,
          "returnpolicy": "1 year warranty",
          "description": "Rechargeable electric toothbrush with multiple modes.",
          "brand": "CleanTech",
          "availability": true,
          "categories": "Health & Beauty"
        },
        {
          "id": 19,
          "title": "Portable Blender",
          "price": 29.99,
          "image": [
            "https://dummyjson.com/image23.jpg"
          ],
          "discounttag": true,
          "rating": 4.3,
          "discountprice": 24.99,
          "sizes": null,
          "returnpolicy": "30 days return policy",
          "description": "Compact and powerful portable blender for smoothies.",
          "brand": "BlendMaster",
          "availability": true,
          "categories": "Kitchen Appliances"
        },
        {
          "id": 20,
          "title": "Fitness Resistance Bands",
          "price": 19.99,
          "image": [
            "https://dummyjson.com/image24.jpg"
          ],
          "discounttag": false,
          "rating": 4.6,
          "discountprice": null,
          "sizes": null,
          "returnpolicy": "Returns accepted within 30 days",
          "description": "Durable resistance bands for strength training.",
          "brand": "FitGear",
          "availability": true,
          "categories": "Fitness"
        },
        {
          "id": 21,
          "title": "Gaming Headset",
          "price": 89.99,
          "image": [
            "https://dummyjson.com/image25.jpg"
          ],
          "discounttag": true,
          "rating": 4.5,
          "discountprice": 79.99,
          "sizes": null,
          "returnpolicy": "30 days return policy",
          "description": "Comfortable gaming headset with surround sound.",
          "brand": "GamerZone",
          "availability": true,
          "categories": "Gaming"
        },
        {
          "id": 22,
          "title": "Stylish Sunglasses",
          "price": 24.99,
          "image": [
            "https://dummyjson.com/image26.jpg"
          ],
          "discounttag": false,
          "rating": 4.4,
          "discountprice": null,
          "sizes": null,
          "returnpolicy": "Returns accepted within 30 days",
          "description": "UV protection stylish sunglasses for summer.",
          "brand": "SunGuard",
          "availability": true,
          "categories": "Accessories"
        },
        {
          "id": 23,
          "title": "Smart LED Bulb",
          "price": 15.99,
          "image": [
            "https://dummyjson.com/image27.jpg"
          ],
          "discounttag": true,
          "rating": 4.6,
          "discountprice": 12.99,
          "sizes": null,
          "returnpolicy": "30 days return policy",
          "description": "Smart LED bulb with app control and color changing.",
          "brand": "BrightHome",
          "availability": true,
          "categories":"Home Decor"
        },
        {
          "id": 24,
          "title": "Travel Backpack",
          "price": 49.99,
          "image": [
            "https://dummyjson.com/image28.jpg"
          ],
          "discounttag": false,
          "rating": 4.5,
          "discountprice": null,
          "sizes": null,
          "returnpolicy": "Returns accepted within 30 days",
          "description": "Spacious travel backpack with multiple compartments.",
          "brand": "TravelMate",
          "availability": true,
          "categories": "Bags"
        },
          {
            "id": 25,
            "title": "Wireless Charging Pad",
            "price": 29.99,
            "image": [
              "https://dummyjson.com/image29.jpg"
            ],
            "discounttag": true,
            "rating": 4.5,
            "discountprice": 24.99,
            "sizes": null,
            "returnpolicy": "30 days return policy",
            "description": "Fast wireless charging pad for compatible devices.",
            "brand": "ChargeFast",
            "availability": true,
            "categories": "Accessories"
          },
          {
            "id": 26,
            "title": "Smart Thermostat",
            "price": 149.99,
            "image": [
              "https://dummyjson.com/image30.jpg"
            ],
            "discounttag": false,
            "rating": 4.6,
            "discountprice": null,
            "sizes": null,
            "returnpolicy": "1 year warranty",
            "description": "Smart thermostat for energy-efficient temperature control.",
            "brand": "EcoHome",
            "availability": true,
            "categories": "Home Appliances"
          },
          {
            "id": 27,
            "title": "Portable Hard Drive",
            "price": 59.99,
            "image": [
              "https://dummyjson.com/image31.jpg"
            ],
            "discounttag": true,
            "rating": 4.4,
            "discountprice": 49.99,
            "sizes": null,
            "returnpolicy": "30 days return policy",
            "description": "1TB portable hard drive for extra storage.",
            "brand": "DataSafe",
            "availability": true,
            "categories": "Electronics"
          },
          {
            "id": 28,
            "title": "Non-Stick Cookware Set",
            "price": 89.99,
            "image": [
              "https://dummyjson.com/image32.jpg"
            ],
            "discounttag": false,
            "rating": 4.7,
            "discountprice": null,
            "sizes": null,
            "returnpolicy": "Returns accepted within 30 days",
            "description": "Durable non-stick cookware set for all your cooking needs.",
            "brand": "ChefMaster",
            "availability": true,
            "categories": "Kitchenware"
          },
          {
            "id": 29,
            "title": "Men's Sports Watch",
            "price": 99.99,
            "image": [
              "https://dummyjson.com/image33.jpg"
            ],
            "discounttag": true,
            "rating": 4.5,
            "discountprice": 79.99,
            "sizes": null,
            "returnpolicy": "1 year warranty",
            "description": "Stylish sports watch with multiple features.",
            "brand": "TimeMaster",
            "availability": true,
            "categories": "Watches"
          },
          {
            "id": 30,
            "title": "Electric Pressure Cooker",
            "price": 89.99,
            "image": [
              "https://dummyjson.com/image34.jpg"
            ],
            "discounttag": false,
            "rating": 4.8,
            "discountprice": null,
            "sizes": null,
            "returnpolicy": "1 year warranty",
            "description": "Multi-functional electric pressure cooker for quick meals.",
            "brand": "CookPro",
            "availability": true,
            "categories":"Kitchen Appliances"
          },
          {
            "id": 31,
            "title": "Pet Hair Vacuum",
            "price": 129.99,
            "image": [
              "https://dummyjson.com/image35.jpg"
            ],
            "discounttag": true,
            "rating": 4.6,
            "discountprice": 109.99,
            "sizes": null,
            "returnpolicy": "30 days return policy",
            "description": "Efficient vacuum cleaner designed for pet owners.",
            "brand": "PetClean",
            "availability": true,
            "categories": "Home Appliances"
          },
          {
            "id": 32,
            "title": "Gaming Chair",
            "price": 199.99,
            "image": [
              "https://dummyjson.com/image36.jpg"
            ],
            "discounttag": false,
            "rating": 4.9,
            "discountprice": null,
            "sizes": null,
            "returnpolicy": "Returns accepted within 30 days",
            "description": "Ergonomic gaming chair for maximum comfort during long sessions.",
            "brand": "GameComfort",
            "availability": true,
            "categories": "Gaming"
          },
          {
            "id": 33,
            "title": "LED Strip Lights",
            "price": 19.99,
            "image": [
              "https://dummyjson.com/image37.jpg"
            ],
            "discounttag": true,
            "rating": 4.5,
            "discountprice": 14.99,
            "sizes": null,
            "returnpolicy": "30 days return policy",
            "description": "Color-changing LED strip lights for home decor.",
            "brand": "BrightHome",
            "availability": true,
            "categories": "Home Decor"
          },
          {
            "id": 34,
            "title": "Smart Scale",
            "price": 39.99,
            "image": [
              "https://dummyjson.com/image38.jpg"
            ],
            "discounttag": false,
            "rating": 4.3,
            "discountprice": null,
            "sizes": null,
            "returnpolicy": "1 year warranty",
            "description": "Smart scale with body composition analysis.",
            "brand": "HealthTrack",
            "availability": true,
            "categories": "Health & Fitness"
          },
          {
            "id": 35,
            "title": "Portable Air Purifier",
            "price": 89.99,
            "image": [
              "https://dummyjson.com/image39.jpg"
            ],
            "discounttag": true,
            "rating": 4.7,
            "discountprice": 69.99,
            "sizes": null,
            "returnpolicy": "30 days return policy",
            "description": "Compact air purifier for cleaner air on the go.",
            "brand": "PureAir",
            "availability": true,
            "categories": "Home Appliances"
          },
          {
            "id": 36,
            "title": "Wireless Security Camera",
            "price": 99.99,
            "image": [
              "https://dummyjson.com/image40.jpg"
            ],
            "discounttag": false,
            "rating": 4.8,
            "discountprice": null,
            "sizes": null,
            "returnpolicy": "1 year warranty",
            "description": "High-definition wireless security camera for home monitoring.",
            "brand": "SecureHome",
            "availability": true,
            "categories": "Electronics"
          },
          {
            "id": 37,
            "title": "Outdoor Camping Tent",
            "price": 149.99,
            "image": [
              "https://dummyjson.com/image41.jpg"
            ],
            "discounttag": true,
            "rating": 4.5,
            "discountprice": 129.99,
            "sizes": null,
            "returnpolicy": "Returns accepted within 30 days",
            "description": "Spacious camping tent for outdoor adventures.",
            "brand": "CampMaster",
            "availability": true,
            "categories": "Outdoor Gear"
          },
          {
            "id": 38,
            "title": "Women's Dress",
            "price": 29.99,
            "image": [
              "https://dummyjson.com/image1.jpg"
            ],
            "discounttag": true,
            "sizes": Size.m,
            "rating": 4.5,
            "discountprice": 24.99,
            "returnpolicy": "30 days return policy",
            "description": "Stylish and elegant dress for women.",
            "brand": "Fashionista",
            "availability": true,
            "categories":"Women's Fashion"
          },
          {
            "id": 39,
            "title": "Women's Handbag",
            "price": 49.99,
            "image": [
              "https://dummyjson.com/image2.jpg"
            ],
            "discounttag": false,
            "rating": 4.7,
            "sizes": Size.sm,
            "discountprice": null,
            "returnpolicy": "30 days return policy",
            "description": "Trendy handbag for daily use.",
            "brand": "Chic Bags",
            "availability": true,
            "categories":"Women's Fashion"
          },
          {
            "id": 40,
            "title": "Men's Casual Shirt",
            "price": 39.99,
            "image": [
              "https://dummyjson.com/image3.jpg"
            ],
            "discounttag": true,
            "rating": 4.3,
            "sizes": Size.xxl,
            "discountprice": 29.99,
            "returnpolicy": "30 days return policy",
            "description": "Comfortable casual shirt for men.",
            "brand": "Men's Wear",
            "availability": true,
            "categories":"Men's Fashion"
          },
          {
            "id": 41,
            "title": "Men's Sneakers",
            "price": 69.99,
            "image": [
              "https://dummyjson.com/image4.jpg"
            ],
            "discounttag": false,
            "rating": 4.5,
            "sizes": Size.m,
            "discountprice": null,
            "returnpolicy": "30 days return policy",
            "description": "Stylish sneakers for men.",
            "brand": "Sneaker Co.",
            "availability": true,
            "categories":"Men's Fashion"
          },
          {
            "id": 42,
            "title": "Yoga Mat",
            "price": 19.99,
            "image": [
              "https://dummyjson.com/image5.jpg"
            ],
            "discounttag": true,
            "rating": 4.6,
            "sizes": null,
            "discountprice": 14.99,
            "returnpolicy": "30 days return policy",
            "description": "Non-slip yoga mat for workouts.",
            "brand": "FitLife",
            "availability": true,
            "categories":"Sports"
          },
          {
            "id": 43,
            "title": "Dumbbell Set",
            "price": 49.99,
            "image": [
              "https://dummyjson.com/image6.jpg"
            ],
            "discounttag": false,
            "rating": 4.8,
            "sizes": null,
            "discountprice": null,
            "returnpolicy": "30 days return policy",
            "description": "Adjustable dumbbell set for home workouts.",
            "brand": "GymPro",
            "availability": true,
            "categories":"Sports"
          },
          {
            "id": 44,
            "title": "Building Blocks Set",
            "price": 29.99,
            "image": [
              "https://dummyjson.com/image7.jpg"
            ],
            "discounttag": true,
            "rating": 4.5,
            "sizes": null,
            "discountprice": 24.99,
            "returnpolicy": "30 days return policy",
            "description": "Creative building blocks set for kids.",
            "brand": "ToyLand",
            "availability": true,
            "categories":"Toys & Games"
          },
          {
            "id": 45,
            "title": "Puzzle Game",
            "price": 19.99,
            "image": [
              "https://dummyjson.com/image8.jpg"
            ],
            "discounttag": false,
            "rating": 4.3,
            "discountprice": null,
            "sizes": null,
            "returnpolicy": "30 days return policy",
            "description": "Fun and challenging puzzle game for all ages.",
            "brand": "BrainTeaser",
            "availability": true,
            "categories":"Toys & Games"
          },
          {
            "id": 46,
            "title": "The Great Gatsby",
            "price": 14.99,
            "image": [
              "https://dummyjson.com/image9.jpg"
            ],
            "discounttag": false,
            "rating": 4.6,
            "sizes": null,
            "discountprice": null,
            "returnpolicy": "30 days return policy",
            "description": "A classic novel by F. Scott Fitzgerald.",
            "brand": "Classic Literature",
            "availability": true,
            "categories":"Books"
          },
          {
            "id": 47,
            "title": "Becoming",
            "price": 24.99,
            "image": [
              "https://dummyjson.com/image10.jpg"
            ],
            "discounttag": true,
            "rating": 4.8,
            "sizes": null,
            "discountprice": 19.99,
            "returnpolicy": "30 days return policy",
            "description": "A memoir by Michelle Obama.",
            "brand": "Memoir",
            "availability": true,
            "categories":"Books"
          },
          {
            "id": 48,
            "title": "Moisturizing Cream",
            "price": 29.99,
            "image": [
              "https://dummyjson.com/image11.jpg"
            ],
            "discounttag": true,
            "rating": 4.7,
            "sizes": null,
            "discountprice": 24.99,
            "returnpolicy": "30 days return policy",
            "description": "Hydrating cream for all skin types.",
            "brand": "SkinCare Co.",
            "availability": true,
            "categories":" Beauty & Personal Care"
          },
          {
            "id": 49,
            "title": "Lipstick Set",
            "price": 19.99,
            "image": [
              "https://dummyjson.com/image12.jpg"
            ],
            "discounttag": false,
            "rating": 4.5,
            "sizes": null,
            "discountprice": null,
            "returnpolicy": "30 days return policy",
            "description": "Set of vibrant lipsticks.",
            "brand": "Beauty Essentials",
            "availability": true,
            "categories":" Beauty & Personal Care"
          },
          {
            "id": 50,
            "title": "Wooden Dining Table",
            "price": 299.99,
            "image": [
              "https://dummyjson.com/image13.jpg"
            ],
            "discounttag": false,
            "rating": 4.8,
            "sizes": null,
            "discountprice": null,
            "returnpolicy": "30 days return policy",
            "description": "Elegant wooden dining table for your home.",
            "brand": "HomeStyle",
            "availability": true,
            "categories":" Furniture"
          },
          {
            "id": 51,
            "title": "Office Chair",
            "price": 129.99,
            "image": [
              "https://dummyjson.com/image14.jpg"
            ],
            "discounttag": true,
            "rating": 4.6,
            "sizes": null,
            "discountprice": 99.99,
            "returnpolicy": "30 days return policy",
            "description": "Ergonomic office chair for comfort.",
            "brand": "OfficeComfort",
            "availability": true,
            "categories":" Furniture"
          },
          {
            "id": 52,
            "title": "Organic Olive Oil",
            "price": 12.99,
            "image": [
              "https://dummyjson.com/image15.jpg"
            ],
            "discounttag": false,
            "rating": 4.7,
            "sizes": null,
            "discountprice": null,
            "returnpolicy": "30 days return policy",
            "description": "High-quality organic olive oil.",
            "brand": "Healthy Foods",
            "availability": true,
            "categories":" Groceries"
          },
          {
            "id": 53,
            "title": "Whole Grain Bread",
            "price": 3.99,
            "image": [
              "https://dummyjson.com/image16.jpg"
            ],
            "discounttag": true,
            "sizes": null,
            "rating": 4.5,
            "discountprice": 2.99,
            "returnpolicy": "30 days return policy",
            "description": "Fresh whole grain bread.",
            "brand": "Bakery Fresh",
            "availability": true,
            "categories":" Groceries"
          }
        
  ]
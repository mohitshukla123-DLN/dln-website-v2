import type { Product } from "../../types/product";
import { getProductImage } from "../../lib/imageLoader";

export const kurtiProducts: Product[] = [
  {
    id: 1,
    slug: "blue-chikankari-kurta",
    sku: "09M-0B25-46LP",
    color: "Blue",
    name: "Blue Chikankari Kurta",
    category: "Kurti",
    subcategory: "Straight",
    price: 7999,
    image: getProductImage("kurti/chikankari-blue-01.jpeg"),
    images: [
              getProductImage("kurti/chikankari-blue-01.jpeg"),
              getProductImage("kurti/chikankari-blue-02.jpeg"),
              getProductImage("kurti/chikankari-blue-03.jpeg"),
            ],
    featured: true,
    bestseller: true,
    badge: "BESTSELLER",
    stock: 5,
    availability: "In Stock",

    rating: 4.9,
    reviews: 124,

    description:
      "Des1: Premium handcrafted Chikankari kurta made with luxurious cotton fabric and traditional Lucknow embroidery.",

    sizes: ["S", "M", "L", "XL", "XXL"],
    specifications: {
        fabric: "Premium Cotton",
        embroidery: "Handcrafted Lucknow Chikankari",
        fit: "Regular Fit",
        occasion: "Festive • Wedding • Casual",
        care: "Dry Clean Recommended",
      },
  },

  {
    id: 2,
    slug: "green-chikankari-kurta",
    sku: "10M-0A01-40R",
    color: "Green",
    name: "Green Chikankari Kurta",
    category: "Kurti",
    subcategory: "Straight",
    price: 8499,
    image: getProductImage("kurti/chikankari-green-01.jpeg"),
    images: [
      getProductImage("kurti/chikankari-green-01.jpeg"),
    ],
    featured: true,
    bestseller: true,
    badge: "NEW",
    stock: 18,
    availability: "In Stock",

    rating: 4.8,
    reviews: 200,

    description:
      "Des2: Premium handcrafted green Chikankari kurta made with fine cotton fabric and authentic Lucknow embroidery.",

    sizes: ["XL", "XXL"],
    specifications: {
        fabric: "Premium Cotton",
        embroidery: "Traditional Chikankari",
        fit: "Regular Fit",
        occasion: "Festive • Traditional Wear",
        care: "Dry Clean Recommended",
      },
  },

  {
    id: 3,
    slug: "white-chikankari-kurta",
    sku: "09M-0A22-46DP",
    color: "White",
    name: "White Chikankari Kurta",
    category: "Kurti",
    subcategory: "Straight",
    price: 7499,
    image: getProductImage("kurti/chikankari-white-01.jpeg"),
    images: [
      getProductImage("kurti/chikankari-white-01.jpeg"),
    ],
    featured: true,
    bestseller: true,
    badge: "LIMITED",
    stock: 2,
    availability: "In Stock",

    rating: 4.7,
    reviews: 50,

    description:
      "Des3: Elegant white Chikankari kurta crafted with premium cotton and timeless handcrafted embroidery.",

    sizes: ["S", "M", "L"],
    specifications: {
        fabric: "Premium Cotton",
        embroidery: "Handcrafted Chikankari",
        fit: "Regular Fit",
        occasion: "Festive • Casual",
        care: "Dry Clean Recommended",
      },
  },
];
import { resolve } from 'path'

const pages = [
  {name: 'index',             path: resolve(__dirname, '../index.html')                  },
  {name: 'home',              path: resolve(__dirname, '../pages/home.html')             },
  {name: '404',               path: resolve(__dirname, '../pages/404.html')              },
  {name: 'contacts',          path: resolve(__dirname, '../pages/contacts.html')         },
  {name: 'catalog',           path: resolve(__dirname, '../pages/catalog.html')          },
  {name: 'product',           path: resolve(__dirname, '../pages/product.html')          },
  {name: 'sales',             path: resolve(__dirname, '../pages/sales.html')            },
  {name: 'sale',              path: resolve(__dirname, '../pages/sale.html')             },
  {name: 'reviews',           path: resolve(__dirname, '../pages/reviews.html')          },
  {name: 'payment-delivery',  path: resolve(__dirname, '../pages/payment-delivery.html') },
  {name: 'guarantees',        path: resolve(__dirname, '../pages/guarantees.html')       },
  {name: 'politic',           path: resolve(__dirname, '../pages/politic.html')          },
  {name: 'partners',          path: resolve(__dirname, '../pages/partners.html')         },
  {name: 'security',          path: resolve(__dirname, '../pages/security.html')         },
  {name: 'basket',            path: resolve(__dirname, '../pages/basket.html')           },
  {name: 'checkout',          path: resolve(__dirname, '../pages/checkout.html')         },
  {name: 'blog',              path: resolve(__dirname, '../pages/blog.html')             },
  {name: 'article',           path: resolve(__dirname, '../pages/article.html')          },
];

export default pages
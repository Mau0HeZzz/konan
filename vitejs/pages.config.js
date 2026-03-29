import { resolve } from 'path'

const pages = [
  {name: 'index',    path: resolve(__dirname, '../index.html')         },
  {name: 'home',     path: resolve(__dirname, '../pages/home.html')    },
  {name: '404',      path: resolve(__dirname, '../pages/404.html')     },
  {name: 'contacts', path: resolve(__dirname, '../pages/contacts.html')},
  {name: 'catalog',  path: resolve(__dirname, '../pages/catalog.html') },
  {name: 'product',  path: resolve(__dirname, '../pages/product.html') },
];

export default pages
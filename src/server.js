async function initializeDatabase(database,pool) {
  try {
    const [rows] = await pool.query(`SHOW DATABASES LIKE '${database}';`);

    if(rows.length == 0) {
      console.log('Database doesnt exist! Creating database...');

      const query = `
      CREATE DATABASE IF NOT EXISTS ${database};
      USE ${database};
      CREATE TABLE products (
        product_id INT PRIMARY KEY,
        type VARCHAR(10),
        price INT,
        min_age INT,
        max_age INT,
        collection VARCHAR(30),
        priority INT
      );

      CREATE TABLE product_variations (
        variation_id INT PRIMARY KEY,
        product_id INT,
        quantity INT,
        model_image_id VARCHAR(255),
        colour VARCHAR(10),
        design VARCHAR(50),
        size VARCHAR(25),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      );`;
      await pool.query(query);
      console.log('Database Created.');
    }
  } catch (error) {
    console.error(error);
    throw new Error("Database Initialization Or Creation Failed");
  }
}

async function insertProductByParameter(database,pool,postParameter) {
  try {
    const query = `
    USE ${database};
    INSERT INTO products (
      product_id,
      type,
      price,
      min_age,
      max_age,
      collection,
      priority
    ) VALUES (?, ?, ?, ?, ?, ?, ?);`;

    await pool.query(query,[
      postParameter.product_id || null,
      postParameter.type || null,
      postParameter.price || null,
      postParameter.min_age || null,
      postParameter.max_age || null,
      postParameter.collection || null,
      postParameter.priority || null,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('Error Inserting Data Into Database');
  }

  try {
    const query = `
    USE ${database};
    INSERT INTO product_variations (
      variation_id,
      product_id,
      quantity,
      model_image_id,
      colour,
      design,
      size
    ) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    await pool.query(query,[
      postParameter.variation_id || null,
      postParameter.product_id || null,
      postParameter.quantity || null,
      postParameter.model_image_id || null,
      postParameter.colour || null,
      postParameter.design || null,
      postParameter.size || null,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('Error Inserting Data Into Database');
  }
}

fetchParameter = function({image_Id = null,
                          type = null,
                          max_price = null,
                          min_price = null,
                          colour = null,
                          max_age = null,
                          min_age = null,
                          collection = null,
                          priority = null,
                          quantity = null}) {
  this.image_Id = image_Id;
  this.type = type;
  this.max_price = max_price;
  this.min_price = min_price;
  this.colour = colour;
  this.min_age = min_age;
  this.max_age = max_age;
  this.collection = collection;
  this.priority = priority;
}

postParameter = function ({product_id = null,
                          type = null,
                          price = null,
                          min_age = null,
                          max_age = null,
                          collection = null,
                          priority = null,
                          variation_id = null,
                          quantity = null,
                          model_image_id = null,
                          colour = null,
                          design = null}) {
  this.product_id = product_id,
  this.type = type,
  this.price = price,
  this.min_age = min_age,
  this.max_age = max_age,
  this.collection = collection,
  this.priority = priority,
  this.variation_id = variation_id,
  this.quantity = quantity,
  this.model_image_id = model_image_id,
  this.colour = colour,
  this.design = design
}

function filehandler(multer,fs,path) {
  //Directory to store images;
  const UPLOAD_DIR = '../public/images';
  
  //Check if upload directory exists
  fs.mkdirSync(UPLOAD_DIR,{recursive: true});

  const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (request,file,callback) => {
      callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });

  // Initialize upload variable
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // Max file size: 10MB
    fileFilter: (req, file, callback) => {
      const fileTypes = /jpeg|jpg|png/;  // Allowed file extensions
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);

      if (mimetype && extname) {
        return callback(null, true);
      } else {
        callback('Error: Images Only!');
      }
    }
  });

  return upload;
}

async function fetchData(database,fetchParameter,pool) {
  const whereClause = ` 
                      SELECT 
                          p.type, p.price, p.min_age, p.max_age, p.collection, 
                          pv.model_image_id, pv.colour, pv.design, pv.quantity
                      FROM 
                          products p
                      JOIN 
                          product_variations pv ON p.product_id = pv.product_id
                      WHERE 
                          p.type = COALESCE(?, p.type)
                          AND p.price <= COALESCE(?, p.price)
                          AND p.price >= COALESCE(?, p.price)
                          AND p.min_age >= COALESCE(?, p.min_age)
                          AND p.max_age <= COALESCE(?, p.max_age)
                          AND p.collection = COALESCE(?, p.collection)
                          AND p.priority = COALESCE(?, p.priority)
                          AND pv.model_image_id = COALESCE(?, pv.model_image_id)
                          AND pv.colour = COALESCE(?, pv.colour);
                        `;

  try {
    await pool.query(`USE ${database};`);
    const [rows,fields] = await pool.query(whereClause,[
      fetchParameter.type,
      fetchParameter.max_price,
      fetchParameter.min_price,
      fetchParameter.min_age,
      fetchParameter.max_age,
      fetchParameter.collection,
      fetchParameter.priority,
      fetchParameter.image_Id,
      fetchParameter.colour,
    ]);
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('Error Fetching Data From Database');
  }
}

async function subQuery(database,pool,model_image_id) {
  let query = `
                      SELECT 
                          p.type,
                          p.price,
                          p.min_age,
                          p.max_age,
                          p.collection,
                          pv.model_image_id,
                          pv.colour,
                          pv.design,
                          pv.quantity
                      FROM 
                          products p
                      JOIN 
                          product_variations pv ON p.product_id = pv.product_id
                      WHERE 
                          pv.product_id = (
                              SELECT product_id 
                              FROM product_variations 
                              WHERE model_image_id = COALESCE(?, model_image_id)
                          );
                    `;
  try {
    await pool.query(`USE ${database};`);
    const [rows,fields] = await pool.query(query,[model_image_id]);
    return rows;
  } catch (error) {
    throw new Error(`Error Subquery.`);
  }
}

function endpoints(express,pool,upload,database) {
  const endpoint = express.Router();

  endpoint.get('/',async (request,response) => {
    const parameter = new fetchParameter({priority: 0});
    const productData = await fetchData(database,parameter,pool);
    response.render('home',{product:productData});
  });

  endpoint.get('/shop',(request,response) => {
    response.render('shop');
  });

  endpoint.get('/contact',(request,response) => {
    response.render('contact');
  });

  endpoint.get('/cart',(request,response) => {
    response.render('cart');
  });

  endpoint.get('/product',async (request,response) => {
    let image_id;
    if(request.query.id != undefined) {
      image_id = request.query.id;
    } else {
      image_id = "NOT FOUND";
    }
    let productData = await subQuery(database,pool,image_id);
    response.render('product', {product: productData});
  });

  endpoint.get('/admin',(request,response) => {
    response.render('admin');
  });
  return endpoint;
}

(function main() {
  const express = require('express');
  const mysql = require('mysql2/promise');
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');
  const database = "node";
  let pool;

  try {
     pool = mysql.createPool({
      host: 'localhost',
      user: 'node',
      password: 'node_js',
      waitForConnections: true,
      connectionLimit: 10,
      multipleStatements: true,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Database Pool Creation Failed.');
  }

  initializeDatabase('node',pool);
  const upload = filehandler(multer,fs,path);

  const app = express();

  app.set('view engine','ejs');
  app.set('views','/home/neon/buzz/views');

  app.use(express.static('/home/neon/buzz/public'));
  const endpoint = endpoints(express,pool,upload,database);
  app.use('/',endpoint);

  app.listen(8080, () => {
    console.log("Server running at https://localhost:8080");
  });
})();

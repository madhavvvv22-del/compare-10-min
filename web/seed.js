const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ighiuogqhykhzqzlnqsn.supabase.co';
const supabaseKey = 'sb_publishable_VIwjAZA3yIpBknPmdMofgw_6OgWhxdo';
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  // MILK
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Amul Taaza Toned Fresh Milk', quantity: '500 ml', price: 27, mrp: 27, provider: 'blinkit', eta_minutes: 10, delivery_fee: 15 },
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Amul Taaza Toned Fresh Milk', quantity: '500 ml', price: 27, mrp: 27, provider: 'zepto', eta_minutes: 9, delivery_fee: 15 },
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Amul Taaza Toned Milk', quantity: '500 ml', price: 27, mrp: 27, provider: 'instamart', eta_minutes: 13, delivery_fee: 25 },
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Amul Taaza Toned Milk', quantity: '500 ml', price: 27, mrp: 27, provider: 'bigbasket', eta_minutes: 20, delivery_fee: 30 },
  
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Mother Dairy Full Cream Milk', quantity: '1 L', price: 68, mrp: 68, provider: 'blinkit', eta_minutes: 10, delivery_fee: 15 },
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Mother Dairy Full Cream Milk', quantity: '1 L', price: 68, mrp: 68, provider: 'zepto', eta_minutes: 11, delivery_fee: 15 },
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Mother Dairy Full Cream', quantity: '1 L', price: 68, mrp: 68, provider: 'instamart', eta_minutes: 15, delivery_fee: 20 },
  { category: 'milk', query_tags: 'milk amul mother dairy cow buffalo', title: 'Mother Dairy Full Cream Milk', quantity: '1 L', price: 67, mrp: 68, provider: 'bigbasket', eta_minutes: 25, delivery_fee: 5 },

  // BREAD
  { category: 'bread', query_tags: 'bread white brown harvest britannia', title: 'Britannia Daily Fresh White Bread', quantity: '400 g', price: 40, mrp: 40, provider: 'blinkit', eta_minutes: 10, delivery_fee: 15 },
  { category: 'bread', query_tags: 'bread white brown harvest britannia', title: 'Britannia Daily Fresh White Bread', quantity: '400 g', price: 38, mrp: 40, provider: 'zepto', eta_minutes: 9, delivery_fee: 15 },
  { category: 'bread', query_tags: 'bread white brown harvest britannia', title: 'Britannia White Bread', quantity: '400 g', price: 40, mrp: 40, provider: 'instamart', eta_minutes: 14, delivery_fee: 26 },
  { category: 'bread', query_tags: 'bread white brown harvest britannia', title: 'Britannia Daily White Bread', quantity: '400 g', price: 36, mrp: 40, provider: 'bigbasket', eta_minutes: 25, delivery_fee: 0 },
  
  // COLA
  { category: 'coca cola', query_tags: 'coke coca cola pepsi soft drink thums up sprite', title: 'Coca-Cola Original', quantity: '750 ml', price: 45, mrp: 45, provider: 'blinkit', eta_minutes: 11, delivery_fee: 15 },
  { category: 'coca cola', query_tags: 'coke coca cola pepsi soft drink thums up sprite', title: 'Coca-Cola Original', quantity: '750 ml', price: 45, mrp: 45, provider: 'zepto', eta_minutes: 8, delivery_fee: 15 },
  { category: 'coca cola', query_tags: 'coke coca cola pepsi soft drink thums up sprite', title: 'Coca-Cola Can', quantity: '300 ml', price: 40, mrp: 40, provider: 'instamart', eta_minutes: 13, delivery_fee: 20 },
  { category: 'coca cola', query_tags: 'coke coca cola pepsi soft drink thums up sprite', title: 'Coca Cola Soft Drink', quantity: '750 ml', price: 43, mrp: 45, provider: 'bigbasket', eta_minutes: 18, delivery_fee: 15 },
  
  // MAGGI
  { category: 'maggi', query_tags: 'maggi noodles yippee pasta 2 minute', title: 'Maggi 2-Minute Masala Noodles', quantity: '140 g', price: 30, mrp: 30, provider: 'blinkit', eta_minutes: 8, delivery_fee: 0 },
  { category: 'maggi', query_tags: 'maggi noodles yippee pasta 2 minute', title: 'Maggi Masala Noodles', quantity: '140 g', price: 28, mrp: 30, provider: 'zepto', eta_minutes: 12, delivery_fee: 15 },
  { category: 'maggi', query_tags: 'maggi noodles yippee pasta 2 minute', title: 'Nestle Maggi Masala Noodles', quantity: '140 g', price: 30, mrp: 30, provider: 'instamart', eta_minutes: 16, delivery_fee: 25 },
  { category: 'maggi', query_tags: 'maggi noodles yippee pasta 2 minute', title: 'Maggi 2 Minute Masala Single', quantity: '140 g', price: 29, mrp: 30, provider: 'bigbasket', eta_minutes: 22, delivery_fee: 20 },
  
  // EGGS
  { category: 'eggs', query_tags: 'eggs egg white brown farm country', title: 'Farm Fresh White Eggs', quantity: '6 pack', price: 55, mrp: 60, provider: 'blinkit', eta_minutes: 12, delivery_fee: 15 },
  { category: 'eggs', query_tags: 'eggs egg white brown farm country', title: 'Healthy White Eggs', quantity: '6 pack', price: 58, mrp: 60, provider: 'zepto', eta_minutes: 10, delivery_fee: 10 },
  { category: 'eggs', query_tags: 'eggs egg white brown farm country', title: 'Fresh White Eggs', quantity: '6 pack', price: 50, mrp: 65, provider: 'instamart', eta_minutes: 14, delivery_fee: 20 },
  { category: 'eggs', query_tags: 'eggs egg white brown farm country', title: 'BB Royal White Eggs', quantity: '6 pack', price: 48, mrp: 55, provider: 'bigbasket', eta_minutes: 25, delivery_fee: 15 },
];

async function setupDatabase() {
  console.log('Seeding Supabase data table...');
  try {
    const { data: fetchCurrent, error: fetchErr } = await supabase.from('groceries').select('*').limit(1);
    
    // If table doesn't exist, this will throw an error to the dashboard. But if it's there via SQL console
    // I will write the insert right now. Assuming you ran the CREATE script in the dashboard SQL editor.
    if (fetchErr) {
        console.error("Please create the table in Supabase SQL editor first with this code:");
        console.error(`
          CREATE TABLE groceries (
            id SERIAL PRIMARY KEY,
            category TEXT,
            query_tags TEXT,
            title TEXT,
            quantity TEXT,
            price INTEGER,
            mrp INTEGER,
            provider TEXT,
            eta_minutes INTEGER,
            delivery_fee INTEGER
          );
        `);
    } else {
        console.log("Emptying table first...");
        await supabase.from('groceries').delete().neq('id', 0); // truncate hack

        console.log('Inserting mock data...');
        const { data, error } = await supabase.from('groceries').insert(products);
        if (error) throw error;
        console.log('Successfully seeded database array!');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

setupDatabase();

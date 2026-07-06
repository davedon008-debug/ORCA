const testOrders = async () => {
  try {
    // 1. Login to get token
    const loginRes = await fetch('http://localhost:5001/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bigdon.com', password: '123456' })
    });
    
    if (!loginRes.ok) {
      console.error('Login failed during orders test prep:', loginRes.status);
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token:', token);

    // 2. Fetch orders
    const ordersRes = await fetch('http://localhost:5001/api/orders/myorders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const ordersData = await ordersRes.json();
    if (ordersRes.ok) {
      console.log('Fetch Orders Succeeded!');
      console.log('Orders Count:', ordersData.length);
      console.log('Orders:', ordersData);
    } else {
      console.log('Fetch Orders Failed!');
      console.log('Status:', ordersRes.status);
      console.log('Error Data:', ordersData);
    }
  } catch (error) {
    console.error('Error in testOrders:', error.message);
  }
};

testOrders();

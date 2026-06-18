/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const http = require('http');
  const https = require('https');
  
  const payload = JSON.stringify({
    templateType: 'artisan_registration',
    artisanData: {
      id: e.record.id,
      name: e.record.get('name'),
      email: e.record.get('email'),
      phone: e.record.get('phone'),
      category: e.record.get('category'),
      bio: e.record.get('bio'),
      experience_years: e.record.get('experience_years'),
      city: e.record.get('city'),
      status: e.record.get('status'),
      created_date: e.record.get('created_date')
    }
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/notifications/send-email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Artisan registration notification sent successfully:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error sending artisan registration notification:', error.message);
  });

  req.write(payload);
  req.end();

  e.next();
}, 'artisans');